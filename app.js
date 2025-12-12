import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

const debugEl = document.getElementById("debug");
function log(msg) {
  const line = `[${new Date().toLocaleTimeString()}] ${msg}\n`;
  if (debugEl) debugEl.textContent += line;
}

log("app.js loaded ✅");

const firebaseConfig = {
  apiKey: "AIzaSyCio4mXX3YzB7DXnvPiHvLAyBWEBgM_8Ps",
  authDomain: "frizzyowns-app.firebaseapp.com",
  projectId: "frizzyowns-app",
  storageBucket: "frizzyowns-app.firebasestorage.app",
  messagingSenderId: "443774009075",
  appId: "1:443774009075:web:3f5a2c4dfee927d991c186"
};

let app, db, storage;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  log("Firebase initialized ✅");
} catch (e) {
  log("Firebase init ERROR: " + (e?.message || e));
  throw e;
}

const form = document.getElementById("submitForm");
if (!form) {
  log("ERROR: submitForm not found in HTML");
} else {
  log("Form found ✅");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    log("Submit clicked ✅");

    try {
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const notes = document.getElementById("notes").value.trim();
      const files = document.getElementById("photos").files;

      log("Creating Firestore doc...");
      const docRef = await addDoc(collection(db, "submissions"), {
        name,
        email,
        notes,
        status: "Submitted",
        createdAt: serverTimestamp()
      });

      log("Firestore doc created ✅ id=" + docRef.id);

      // Photos are optional; skip if none
      if (files && files.length) {
        log(`Uploading ${files.length} photo(s)...`);
        for (const file of files) {
          const fileRef = ref(storage, `submissions/${docRef.id}/${file.name}`);
          await uploadBytes(fileRef, file);
          log("Uploaded ✅ " + file.name);
        }
      } else {
        log("No photos selected (ok).");
      }

      alert("Submitted! ID: " + docRef.id);
      form.reset();
      log("Done ✅");
    } catch (err) {
      log("SUBMIT ERROR: " + (err?.message || err));
      alert("Submit failed. See Debug box on page.");
    }
  });
}
