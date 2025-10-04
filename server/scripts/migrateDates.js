require("dotenv").config();
const mongoose = require("mongoose");
const Blog = require("../models/Blog");

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI not set in environment");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB for Date migration");

  // find docs that have a `Date` field set (legacy) and migrate into createdAt
  const all = await Blog.find({ Date: { $exists: true } }).lean();
  let updated = 0;
  let skipped = 0;
  for (const doc of all) {
    const current = doc.Date;
    console.log("\n---");
    console.log("Doc:", doc._id.toString());
    console.log("Original Date field:", JSON.stringify(current));

    // If no Date or already a Date object in Mongo, skip
    if (!current) {
      console.log("Skipping: no Date value");
      skipped++;
      continue;
    }

    if (current instanceof Date) {
      console.log("Skipping: Date is already a Date object");
      skipped++;
      continue;
    }

    // Handle Mongo shell wrappers like { $date: { $numberLong: '...' } }
    let candidate = current;
    try {
      if (typeof current === "object" && current.$date) {
        const inner = current.$date;
        if (inner && inner.$numberLong) candidate = Number(inner.$numberLong);
        else candidate = inner;
      }

      // parse numeric timestamps or date strings
      let parsed;
      if (
        typeof candidate === "number" ||
        (!isNaN(Number(candidate)) && String(candidate).trim() !== "")
      ) {
        parsed = new Date(Number(candidate));
      } else if (typeof candidate === "string") {
        const s = candidate.trim();
        parsed = new Date(s);
        if (isNaN(parsed.getTime())) {
          const m = s.match(
            /^\s*(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:\s*,?\s*(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?)?\s*$/i
          );
          if (m) {
            const day = Number(m[1]);
            const month = Number(m[2]);
            const year = Number(m[3]);
            let hour = m[4] ? Number(m[4]) : 0;
            const minute = m[5] ? Number(m[5]) : 0;
            const second = m[6] ? Number(m[6]) : 0;
            const ampm = m[7] ? m[7].toLowerCase() : null;
            if (ampm) {
              if (ampm === "pm" && hour < 12) hour += 12;
              if (ampm === "am" && hour === 12) hour = 0;
            }
            parsed = new Date(year, month - 1, day, hour, minute, second);
          }
        }
      } else {
        parsed = new Date(candidate);
      }

      if (isNaN(parsed.getTime())) {
        console.warn(`Could not parse Date for doc ${doc._id}:`, current);
        skipped++;
        continue;
      }

      console.log("Parsed createdAt:", parsed.toISOString());

      // set createdAt if it's missing or invalid
      const setOps = {};
      if (!doc.createdAt || isNaN(new Date(doc.createdAt).getTime())) {
        setOps.createdAt = parsed;
        console.log("Will set createdAt to parsed value");
      } else {
        console.log("Existing createdAt present and valid; will not overwrite");
      }

      // unset legacy Date field
      const update = { $unset: { Date: "" } };
      if (Object.keys(setOps).length) update.$set = setOps;
      const res = await Blog.updateOne({ _id: doc._id }, update);
      console.log("Update result:", res.result || res);
      updated++;
    } catch (err) {
      console.error("Error updating doc", doc._id, err);
      skipped++;
    }
  }

  console.log(`Migration complete. Updated: ${updated}, Skipped: ${skipped}`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Migration failed", err);
  process.exit(1);
});
