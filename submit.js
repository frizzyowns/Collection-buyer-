const debugEl = document.getElementById("debug");
function log(msg) {
  const line = `[${new Date().toLocaleTimeString()}] ${msg}\n`;
  if (debugEl) debugEl.textContent += line;
}

log("submit.js loaded ✅");

const firebaseConfig = {
  apiKey: "AIzaSyCio4mXX3YzB7DXnvPiHvLAyBWEBgM_8Ps",
  authDomain: "frizzyowns-app.firebaseapp.com",
  projectId: "frizzyowns-app",
  storageBucket: "frizzyowns-app.firebasestorage.app",
  messagingSenderId: "443774009075",
  appId: "1:443774009075:web:3f5a2c4dfee927d991c186"
};

try {
  firebase.initializeApp(firebaseConfig);
  log("Firebase initialized ✅");
} catch (e) {
  log("Firebase init error (likely already initialized)");
}

const db = firebase.firestore();
const storage = firebase.storage();

const form = document.getElementById("submitForm");
if (!form) {
  log("❌ submitForm not found");
} else {
  log("Form found ✅");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    log("Submit clicked ✅");

    try {
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const notes = document.getElementById("notes").value;
      const files = document.getElementById("photos").files;

      const docRef = await db.collection("submissions").add({
        name,
        email,
        notes,
        status: "Submitted",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      log("Firestore doc created ✅ " + docRef.id);

      if (files && files.length) {
        for (const file of files) {
          const path = `submissions/${docRef.id}/${file.name}`;
          await storage.ref(path).put(file);
          log("Uploaded ✅ " + file.name);
        }
      }

      alert("Submitted!");
      form.reset();
      log("Done ✅");

    } catch (err) {
      log("❌ ERROR: " + err.message);
      alert("Submit failed — see Debug box");
    }
  });
}
