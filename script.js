// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyAcd6tU1FA7_zKjrlhM8upxhrIWfK-TdnU",
  authDomain: "event-site-15553.firebaseapp.com",
  projectId: "event-site-15553",
  storageBucket: "event-site-15553.firebasestorage.app",
  messagingSenderId: "304719309473",
  appId: "1:304719309473:web:a64e109648c96b1cd55ee0",
  measurementId: "G-TFLFFQRJ8J",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentLang = "en";
const titleEl = document.getElementById("title");
const gallery = document.getElementById("gallery");
const popupContainer = document.getElementById("popupContainer");
const qrContainer = document.getElementById("qrContainer");

const titles = {
  en: "Events & Exhibitions",
  jp: "イベント＆展示会",
  cn: "活动与展览",
};

let isAdmin = false;
const adminToggleBtn = document.getElementById("adminToggleBtn");

// ========== 언어 설정 ==========
function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll(".lang").forEach((el) => (el.style.display = "none"));
  document.querySelectorAll("." + lang).forEach((el) => (el.style.display = "block"));
  titleEl.textContent = titles[lang];
}

// ========== 팝업 열기/닫기 ==========
function openPopup(id) {
  document.querySelectorAll(".popup").forEach((p) => {
    p.style.display = "none";
    p.classList.remove("show");
  });
  let popup = document.getElementById(id);
  if (popup) {
    popup.style.display = "flex";
    setTimeout(() => popup.classList.add("show"), 10);
  }
}
function closePopup(id) {
  let popup = document.getElementById(id);
  if (!popup) return;
  popup.classList.remove("show");
  setTimeout(() => (popup.style.display = "none"), 300);
}

// ========== QR 열기/닫기 ==========
function openQR(id) {
  let qr = document.getElementById(id);
  if (!qr) return;
  qr.style.display = "flex";
  setTimeout(() => qr.classList.add("show"), 10);
}
function closeQR(id) {
  let qr = document.getElementById(id);
  if (!qr) return;
  qr.classList.remove("show");
  setTimeout(() => (qr.style.display = "none"), 300);
}

// ========== 지도 팝업 ==========
function openMap(place) {
  let mapUrl = "https://www.google.com/maps?q=" + encodeURIComponent(place) + "&output=embed";
  let mapPopup = document.createElement("div");
  mapPopup.className = "popup";
  mapPopup.innerHTML = `<div class="popup-content">
    <button class="close-btn" onclick="this.parentElement.parentElement.remove()">✖</button>
    <iframe src="${mapUrl}" style="width:100%;height:500px;border:0;border-radius:10px;"></iframe>
  </div>`;
  document.body.appendChild(mapPopup);
  mapPopup.style.display = "flex";
  setTimeout(() => mapPopup.classList.add("show"), 10);

  let preventClick = false;

  const closeMapOnOutside = (e) => {
    if (!e.target.closest(".popup-content")) {
      e.stopPropagation();
      mapPopup.remove();
      preventClick = true;
      setTimeout(() => (preventClick = false), 50);
    }
  };

  mapPopup.addEventListener("click", (e) => {
    if (preventClick) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    closeMapOnOutside(e);
  });
  mapPopup.addEventListener("touchend", (e) => {
    if (preventClick) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    closeMapOnOutside(e);
  });

  const content = mapPopup.querySelector(".popup-content");
  if (content) {
    content.addEventListener("click", (e) => e.stopPropagation());
    content.addEventListener("touchend", (e) => e.stopPropagation());
  }
}

// ========== 이벤트 렌더링 ==========
function renderEvents(events) {
  gallery.innerHTML = "";
  popupContainer.innerHTML = "";
  qrContainer.innerHTML = "";

  events.forEach((event) => {
    // 썸네일 이미지
    let img = document.createElement("img");
    img.src = event.img;
    img.className = "thumbnail";
    img.onclick = () => openPopup(event.id);
    gallery.appendChild(img);

    // 팝업
    let popup = document.createElement("div");
    popup.className = "popup";
    popup.id = event.id;
    popup.innerHTML = `<div class="popup-content">
      <button class="close-btn" onclick="closePopup('${event.id}')">✖</button>
      <img src="${event.img}">
      <div class="info">
        <div class="lang en">${event.title.en}<br>Date: ${event.date.en}<br>Location: ${event.location.en}</div>
        <div class="lang jp">${event.title.jp}<br>日付: ${event.date.jp}<br>場所: ${event.location.jp}</div>
        <div class="lang cn">${event.title.cn}<br>日期: ${event.date.cn}<br>地点: ${event.location.cn}</div>
        <div class="action-buttons">
          <button onclick="openMap('${event.map}')">📍 MAP</button>
          <button onclick="openQR('${event.id}qr')">📱 QR</button>
          ${
            isAdmin
              ? `<button onclick="deleteEvent('${event.id}')"
                  style="background:#c0392b; margin-left:10px;">삭제</button>`
              : ""
          }
        </div>
      </div>
    </div>`;
    popupContainer.appendChild(popup);

    // QR 팝업
    let qr = document.createElement("div");
    qr.className = "qr-popup";
    qr.id = event.id + "qr";
    qr.innerHTML = `<div class="qr-box"><div class="qr-close" onclick="closeQR('${event.id}qr')">✖</div><img src="${event.qr}"></div>`;
    qrContainer.appendChild(qr);
  });
}

// ========== Firestore에서 이벤트 데이터 불러오기 ==========
async function loadEventsFromFirestore() {
  try {
    const eventsCol = collection(db, "events");
    const eventsSnapshot = await getDocs(eventsCol);
    const eventsList = eventsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    renderEvents(eventsList);
  } catch (error) {
    console.error("Error loading events: ", error);
  }
}

// ========== 이벤트 추가 (관리자 전용) ==========
async function addEvent(eventData) {
  try {
    await addDoc(collection(db, "events"), eventData);
    await loadEventsFromFirestore();
  } catch (e) {
    console.error("Error adding event: ", e);
  }
}

// ========== 이벤트 삭제 (관리자 전용) ==========
async function deleteEvent(eventId) {
  try {
    await deleteDoc(doc(db, "events", eventId));
    await loadEventsFromFirestore();
  } catch (e) {
    console.error("Error deleting event: ", e);
  }
}

// ========== 관리자 모드 토글 ==========
adminToggleBtn.addEventListener("click", () => {
  isAdmin = !isAdmin;
  adminToggleBtn.textContent = isAdmin ? "관리자 모드 종료" : "관리자 모드";
  loadEventsFromFirestore();
  if (isAdmin) showAddEventForm();
  else removeAddEventForm();
});

// ========== 이벤트 추가 폼 보여주기 ==========
function showAddEventForm() {
  if (document.getElementById("addEventForm")) return; // 중복 생성 방지

  const form = document.createElement("div");
  form.id = "addEventForm";
  form.style.position = "fixed";
  form.style.top = "100px";
  form.style.right = "20px";
  form.style.background = "white";
  form.style.padding = "15px";
  form.style.borderRadius = "10px";
  form.style.zIndex = "3000";
  form.style.width = "300px";
  form.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";

  form.innerHTML = `
    <h3>새 이벤트 추가</h3>
    <label>id (고유값):</label><br />
    <input type="text" id="eventId" /><br />
    <label>이미지 URL:</label><br />
    <input type="text" id="eventImg" /><br />
    <label>QR 이미지 URL:</label><br />
    <input type="text" id="eventQR" /><br />
    <label>지도 위치 (맵):</label><br />
    <input type="text" id="eventMap" /><br />
    <label>제목 (EN):</label><br />
    <input type="text" id="eventTitleEn" /><br />
    <label>제목 (JP):</label><br />
    <input type="text" id="eventTitleJp" /><br />
    <label>제목 (CN):</label><br />
    <input type="text" id="eventTitleCn" /><br />
    <label>날짜 (EN):</label><br />
    <input type="text" id="eventDateEn" /><br />
    <label>날짜 (JP):</label><br />
    <input type="text" id="eventDateJp" /><br />
    <label>날짜 (CN):</label><br />
    <input type="text" id="eventDateCn" /><br />
    <label>위치 (EN):</label><br />
    <input type="text" id="eventLocationEn" /><br />
    <label>위치 (JP):</label><br />
    <input type="text" id="eventLocationJp" /><br />
    <label>위치 (CN):</label><br />
    <input type="text" id="eventLocationCn" /><br />
    <button id="addEventBtn">추가</button>
  `;

  document.body.appendChild(form);

  document.getElementById("addEventBtn").onclick = () => {
    const newEvent = {
      img: document.getElementById("eventImg").value,
      qr: document.getElementById("eventQR").value,
      map: document.getElementById("eventMap").value,
      title: {
        en: document.getElementById("eventTitleEn").value,
        jp: document.getElementById("eventTitleJp").value,
        cn: document.getElementById("eventTitleCn").value,
      },
      date: {
        en: document.getElementById("eventDateEn").value,
        jp: document.getElementById("eventDateJp").value,
        cn: document.getElementById("eventDateCn").value,
      },
      location: {
        en: document.getElementById("eventLocationEn").value,
        jp: document.getElementById("eventLocationJp").value,
        cn: document.getElementById("eventLocationCn").value,
      },
    };

    addEvent(newEvent);
    alert("이벤트가 추가되었습니다!");
  };
}

// ========== 이벤트 추가 폼 제거 ==========
function removeAddEventForm() {
  const form = document.getElementById("addEventForm");
  if (form) form.remove();
}

// ========== 초기 실행 ==========
window.onload = () => {
  setLang("en");
  loadEventsFromFirestore();
};
