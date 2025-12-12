import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCio4mXX3YzB7DXnvPiHvLAyBWEBgM_8Ps",
  authDomain: "frizzyowns-app.firebaseapp.com",
  projectId: "frizzyowns-app",
  storageBucket: "frizzyowns-app.firebasestorage.app",
  messagingSenderId: "443774009075",
  appId: "1:443774009075:web:3f5a2c4dfee927d991c186"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("loginBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  await signInWithEmailAndPassword(auth, email, password);
  loadSubmissions();
});

async function loadSubmissions() {
  const list = document.getElementById("submissions");
  list.innerHTML = "";

  const snap = await getDocs(collection(db, "submissions"));
  snap.forEach((docSnap) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${docSnap.data().name}</strong>
      — ${docSnap.data().status}
      <button data-id="${docSnap.id}">Mark Paid</button>
    `;
    div.querySelector("button").onclick = async () => {
      await updateDoc(doc(db, "submissions", docSnap.id), {
        status: "Paid"
      });
      loadSubmissions();
    };
    list.appendChild(div);
  });
}
