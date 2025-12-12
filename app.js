import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCio4mXX3YzB7DXnvPiHvLAyBWEBgM_8Ps",
  authDomain: "frizzyowns-app.firebaseapp.com",
  projectId: "frizzyowns-app",
  storageBucket: "frizzyowns-app.firebasestorage.app",
  messagingSenderId: "443774009075",
  appId: "1:443774009075:web:3f5a2c4dfee927d991c186"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

document.getElementById("submitForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const notes = document.getElementById("notes").value;
  const files = document.getElementById("photos").files;

  const docRef = await addDoc(collection(db, "submissions"), {
    name,
    email,
    notes,
    status: "Submitted",
    createdAt: serverTimestamp()
  });

  const submissionId = docRef.id;

  for (let file of files) {
    const fileRef = ref(storage, `submissions/${submissionId}/${file.name}`);
    await uploadBytes(fileRef, file);
  }

  alert(`Submitted successfully!\nYour submission ID:\n${submissionId}`);
  e.target.reset();
});
