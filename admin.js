import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

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
  log("Firebase initialized");

  async function loadSubmissions() {
    const list = document.getElementById("submissionList");
    list.innerHTML = "Loading...";

    const querySnapshot = await getDocs(collection(db, "submissions"));
    log("Fetched submissions: " + querySnapshot.size);

    list.innerHTML = "";
    querySnapshot.forEach(docSnap => {
      const d = docSnap.data();
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <h3>${d.name}</h3>
        <p>Email: ${d.email}</p>
        <p>Status: 
          <select data-id="${docSnap.id}" class="status">
            <option ${d.status === "Pending" ? "selected" : ""}>Pending</option>
            <option ${d.status === "Approved" ? "selected" : ""}>Approved</option>
            <option ${d.status === "Denied" ? "selected" : ""}>Denied</option>
          </select>
        </p>
        <p>Paid: <input type="checkbox" class="paid" data-id="${docSnap.id}" ${d.paid ? "checked" : ""} /></p>
        <textarea data-id="${docSnap.id}" class="notes">${d.notes || ""}</textarea>
        <div>${(d.photoURLs || []).map(url => `<img src="${url}" width="100">`).join("")}</div>
      `;
      list.appendChild(div);
    });

    document.querySelectorAll(".status").forEach(el => {
      el.addEventListener("change", async () => {
        await updateDoc(doc(db, "submissions", el.dataset.id), { status: el.value });
        log("Updated status: " + el.dataset.id + " → " + el.value);
      });
    });

    document.querySelectorAll(".paid").forEach(el => {
      el.addEventListener("change", async () => {
        await updateDoc(doc(db, "submissions", el.dataset.id), { paid: el.checked });
        log("Updated paid: " + el.dataset.id + " → " + el.checked);
      });
    });

    document.querySelectorAll(".notes").forEach(el => {
      el.addEventListener("blur", async () => {
        await updateDoc(doc(db, "submissions", el.dataset.id), { notes: el.value });
        log("Updated notes for: " + el.dataset.id);
      });
    });
  }

  loadSubmissions().catch(e => log("Error loading submissions: " + e.message));
} catch (err) {
  log("Firebase Init Error: " + err.message);
}
