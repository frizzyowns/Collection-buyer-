import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCio4mXX3YzB7DXnvPiHvLAyBWEBgM_8Ps",
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

document.getElementById('submissionForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const labelRequest = document.getElementById('labelRequest').checked ? "Yes" : "No";
  const agreement = document.getElementById('agreement').checked;

  if (!agreement) {
    alert("You must agree to the terms before submitting.");
    return;
  }

  const submissionId = Math.floor(Math.random() * 100000);
  const photoFiles = document.getElementById('photos').files;
  const photoURLs = [];

  for (const file of photoFiles) {
    const storageRef = ref(storage, `submissions/${submissionId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    photoURLs.push(downloadURL);
  }

  await addDoc(collection(db, "submissions"), {
    name,
    email,
    phone,
    labelRequest,
    submissionId,
    status: "Pending",
    paid: false,
    notes: "",
    photoURLs
  });

  document.getElementById('confirmation').innerHTML = `
    <h3>Thanks, ${name}!</h3>
    <p>Your Submission ID is <strong>#${submissionId}</strong></p>
    <p>Please include this number in your package.</p>
    <p>Ship to:<br>Your Business Name<br>123 Card Lane<br>Cardtown, CA 90210</p>
  `;

  document.getElementById('submissionForm').reset();
});
