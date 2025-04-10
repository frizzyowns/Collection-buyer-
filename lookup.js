const firebaseConfig = {
  apiKey: "AIzaSyA9wEt-8vx6vl7Fmv3DGaM1riekaoah10U",
  authDomain: "frizzyowns-app.firebaseapp.com",
  projectId: "frizzyowns-app",
  storageBucket: "frizzyowns-app.appspot.com",
  messagingSenderId: "443774009075",
  appId: "1:443774009075:web:3f5a2c4dfee927d991c186",
  measurementId: "G-E98TSKP4PG"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.checkStatus = async function () {
  const id = document.getElementById('lookupId').value;
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = "Searching...";
  const querySnapshot = await getDocs(collection(db, "submissions"));
  let found = false;

  querySnapshot.forEach(docSnap => {
    const d = docSnap.data();
    if (d.submissionId == id) {
      found = true;
      resultDiv.innerHTML = `
        <h3>Status for Submission #${id}</h3>
        <p>Status: <strong>${d.status}</strong></p>
        <p>Paid: <strong>${d.paid ? "Yes" : "No"}</strong></p>
        <p>Admin Notes: ${d.notes || "None"}</p>
      `;
    }
  });

  if (!found) {
    resultDiv.innerHTML = "<p>No submission found with that ID.</p>";
  }
};
