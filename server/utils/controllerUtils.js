const mongoose = require("mongoose");
const fs = require("fs").promises;
const os = require("os");
const path = require("path");

const TEMP_UPLOAD_ROOT = path.join(os.tmpdir(), "blog-app-uploads");

function isValidObjectId(id) {
  return typeof id === "string" && mongoose.Types.ObjectId.isValid(id);
}

function getRequestingUserUID(req) {
  return req.user ? req.user.uid : null;
}

async function cleanupTempFile(tempFilePath) {
  if (!tempFilePath) return;

  try {
    const resolvedTempPath = path.resolve(tempFilePath);
    if (resolvedTempPath.startsWith(TEMP_UPLOAD_ROOT)) {
      await fs.unlink(resolvedTempPath);
    } else {
      console.warn(
        `Refusing to delete file outside temp upload dir: ${resolvedTempPath}`
      );
    }
  } catch (cleanupErr) {
    // Ignore ENOENT (file not found) errors, which can happen if it was already deleted
    if (cleanupErr.code !== "ENOENT") {
      console.error("Failed to delete temp file:", cleanupErr);
    }
  }
}

function normalizeTags(tagInput) {
  if (Array.isArray(tagInput)) return tagInput.filter(Boolean);

  if (typeof tagInput === "string" && tagInput.trim() !== "") {
    return tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  return undefined;
}

function normalizeDate(dateInput) {
  if (!dateInput) return undefined;
  const c = dateInput;
  // If it can be parsed as a number, treat it as a timestamp
  if (!isNaN(Number(c))) return new Date(Number(c));
  // Otherwise, treat it as a date string
  const date = new Date(c);
  return isNaN(date.getTime()) ? undefined : date;
}

module.exports = {
  isValidObjectId,
  getRequestingUserUID,
  cleanupTempFile,
  normalizeDate,
  normalizeTags,
};
