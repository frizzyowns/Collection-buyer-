import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

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

async function loadSubmissions() {
  const container = document.getElementById("submissionList");
  const querySnapshot = await getDocs(collection(db, "submissions"));
  container.innerHTML = "";

  querySnapshot.forEach(docSnap => {
    const d = docSnap.data();
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${d.name}</h3>
      <p><strong>Email:</strong> ${d.email}</p>
      <p><strong>Phone:</strong> ${d.phone || "N/A"}</p>
      <p><strong>Label Request:</strong> ${d.labelRequest}</p>
      <p><strong>Status:</strong> 
        <select data-id="${docSnap.id}" class="status">
          <option value="Pending" ${d.status === "Pending" ? "selected" : ""}>Pending</option>
          <option value="Approved" ${d.status === "Approved" ? "selected" : ""}>Approved</option>
          <option value="Denied" ${d.status === "Denied" ? "selected" : ""}>Denied</option>
        </select>
      </p>
      <p><strong>Paid:</strong> 
        <input type="checkbox" data-id="${docSnap.id}" class="paidToggle" ${d.paid ? "checked" : ""} />
      </p>
      <p><strong>Admin Notes:</strong><br>
        <textarea data-id="${docSnap.id}" class="notes">${d.notes || ""}</textarea>
      </p>
      <p><strong>Photos:</strong><br>
        ${(d.photoURLs || []).map(url => `<img src="${url}" style="width:80px;height:auto;margin:5px;">`).join("")}
      </p>
      <hr>
    `;
    container.appendChild(div);
  });

  addEventListeners();
}

function addEventListeners() {
  document.querySelectorAll(".status").forEach(select => {
    select.addEventListener("change", async function () {
      const docRef = doc(db, "submissions", this.dataset.id);
      await updateDoc(docRef, { status: this.value });
    });
  });

  document.querySelectorAll(".paidToggle").forEach(toggle => {
    toggle.addEventListener("change", async function () {
      const docRef = doc(db, "submissions", this.dataset.id);
      await updateDoc(docRef, { paid: this.checked });
    });
  });

  document.querySelectorAll(".notes").forEach(noteBox => {
    noteBox.addEventListener("blur", async function () {
      const docRef = doc(db, "submissions", this.dataset.id);
      await updateDoc(docRef, { notes: this.value });
    });
  });
}

loadSubmissions();
