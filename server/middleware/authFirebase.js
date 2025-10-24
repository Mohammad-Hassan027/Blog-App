require("dotenv").config();
const admin = require("firebase-admin");
const path = require("path");

let serviceAccount;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  } else {
    const serviceAccountPath = path.resolve(
      process.env.FIREBASE_SERVICE_ACCOUNT_PATH
    );
    serviceAccount = require(serviceAccountPath);
  }
} catch (err) {
  console.error("Failed to load Firebase service account credentials.", err);
}

if (serviceAccount && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

async function firebaseAuth(req, res, next) {
  if (!admin.apps.length) {
    console.error("Firebase Admin SDK not initialized.");
    return res
      .status(500)
      .json({ error: "Authentication service not configured." });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "No token provided or token is malformed" });
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);

    req.user = {
      uid: decoded.uid,
      email: decoded.email || null,
      name: decoded.name || decoded.displayName || decoded.email || null,
      picture: decoded.picture || decoded.photoURL || null,
      claims: decoded,
    };
    next();
  } catch (err) {
    console.error("Firebase token verification failed:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = { firebaseAuth };
