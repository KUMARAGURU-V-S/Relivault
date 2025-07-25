// config/firebaseAdmin.js
const admin = require("firebase-admin");

// Only initialize if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    console.log("✅ Firebase Admin initialized");
  } catch (error) {
    console.error("❌ Error initializing Firebase Admin:", error);
  }
}

module.exports = admin;
