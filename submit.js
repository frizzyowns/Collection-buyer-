import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

function log(msg) {
  const el = document.getElementById("debug");
  el.innerHTML += "<br>" + msg;
}

try {
  const firebaseConfig = {
    apiKey: "AIzaSyA9wEt-8vx6vl7Fmv3DGaM1riekaoah10U",
    authDomain: "frizzyowns-app.firebaseapp.com",
    projectId: "frizzyowns-app",
    storageBucket: "frizzyowns-app.appspot.com",
    messagingSenderId: "443774009075",
    appId: "1:443774009075:web:3f5a2c4dfee927d991c186",
    measurementId: "G-E98TSKP4PG"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);
  log("Firebase initialized");

  document.getElementById("submitForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    log("Form submitted");

    try {
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const labelRequest = document.getElementById("labelRequest").checked;
      const files = document.getElementById("photos").files;

      const photoURLs = [];
      for (let file of files) {
        const fileRef = ref(storage, `submissions/${Date.now()}_${file.name}`);
        log("Uploading: " + file.name);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        photoURLs.push(url);
        log("Uploaded: " + url);
      }

      await addDoc(collection(db, "submissions"), {
        name, email, phone, labelRequest, photoURLs,
        status: "Pending", paid: false, notes: "",
        created: serverTimestamp()
      });

      log("Submission added to Firestore");
      document.getElementById("response").innerText = "Submitted! We'll be in touch soon.";
      document.getElementById("submitForm").reset();
    } catch (err) {
      log("Submission error: " + err.message);
    }
  });
} catch (err) {
  log("Firebase Init Error: " + err.message);
}
