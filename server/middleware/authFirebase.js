require("dotenv").config();
const admin = require("firebase-admin");
const path = require("path");
const serviceAccountPath = path.resolve(
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH
);

let serviceAccount;
try {
  serviceAccount = require(serviceAccountPath);
} catch (err) {
  console.warn(
    "Firebase service account not loaded; ensure FIREBASE_SERVICE_ACCOUNT_PATH points to a valid JSON file",
    serviceAccountPath
  );
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

async function firebaseAuth(req, res, next) {
  if (!admin.apps.length) {
    // firebase admin not initialized — allow anonymous for now
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Normalize common identity fields so downstream code can rely on
    // req.user.name and req.user.picture regardless of provider shape.
    req.user = {
      uid: decoded.uid,
      email: decoded.email || null,
      // prefer explicit name, then displayName, then email as fallback
      name: decoded.name || decoded.displayName || decoded.email || null,
      // some providers put avatar in 'picture' or 'photoURL'
      picture: decoded.picture || decoded.photoURL || null,
      // keep full decoded token for reference
      claims: decoded,
    };
    next();
  } catch (err) {
    console.error("Firebase token verification failed", err);
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = { firebaseAuth };
