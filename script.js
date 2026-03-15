let currentLang = "en";

const events = [
  {
    id:"event1",
    img:"beauty.png",
    qr:"beautyqr.png",
    map:"COEX, Seoul",
    title:{en:"Beauty Expo",jp:"ビューティー展示会",cn:"美容展览"},
    date:{en:"May 20",jp:"5月20日",cn:"5月20日"},
    location:{en:"COEX",jp:"COEX",cn:"COEX"}
  },
  {
    id:"event2",
    img:"soju.png",
    qr:"sojuqr.png",
    map:"Myeongdong Cathedral",
    title:{en:"Soju Festival",jp:"焼酎フェスティバル",cn:"烧酒节"},
    date:{en:"June 15",jp:"6月15日",cn:"6月15日"},
    location:{en:"Seoul",jp:"ソウル",cn:"首尔"}
  },
  {
    id:"event3",
    img:"bts.png",
    qr:"btsqr.png",
    map:"Kakao Friends Hongdae",
    title:{en:"BTS Exhibition",jp:"BTS 展示会",cn:"BTS 展览"},
    date:{en:"July 10",jp:"7月10日",cn:"7月10日"},
    location:{en:"Seoul",jp:"ソウル",cn:"首尔"}
  }
];

const titleEl = document.getElementById("title");
const gallery = document.getElementById("gallery");
const popupContainer = document.getElementById("popupContainer");
const qrContainer = document.getElementById("qrContainer");

const titles = {
  en:"Events & Exhibitions",
  jp:"イベント＆展示会",
  cn:"活动与展览"
};

// ================= LANGUAGE =================
function setLang(lang){
  currentLang = lang;
  document.querySelectorAll(".lang").forEach(el => el.style.display="none");
  document.querySelectorAll("." + lang).forEach(el => el.style.display="block");
  titleEl.textContent = titles[lang];
}

// ================= POPUP =================
function openPopup(id){
  document.querySelectorAll(".popup").forEach(p => {
    p.style.display="none";
    p.classList.remove("show");
  });
  let popup = document.getElementById(id);
  popup.style.display="flex";
  setTimeout(() => popup.classList.add("show"), 10);
}

function closePopup(id){
  let audio = document.getElementById("secretAudio");
  if(audio){
    audio.pause();
    audio.currentTime = 0;
  }
  let popup = document.getElementById(id);
  popup.classList.remove("show");
  setTimeout(() => popup.style.display="none", 300);
}

// ================= QR =================
function openQR(id){
  let qr = document.getElementById(id);
  qr.style.display = "flex";
  setTimeout(() => qr.classList.add("show"), 10);

  if(id === "catQR"){
    let audio = document.getElementById("catAudio");
    if(audio){
      audio.currentTime = 0;
      audio.play();
    }
  }
}

function closeQR(id){
  let qr = document.getElementById(id);
  qr.classList.remove("show");
  setTimeout(() => qr.style.display="none", 300);

  if(id === "catQR"){
    let audio = document.getElementById("catAudio");
    if(audio){
      audio.pause();
      audio.currentTime = 0;
    }
  }
}

// ================= MAP =================
function openMap(place){
  let mapUrl = "https://www.google.com/maps?q="+encodeURIComponent(place)+"&output=embed";
  let mapPopup = document.createElement("div");
  mapPopup.className = "popup";
  mapPopup.innerHTML = `
    <div class="popup-content">
      <button class="close-btn" onclick="this.parentElement.parentElement.remove()">✖</button>
      <iframe id="mapFrame" src="${mapUrl}" style="width:100%;height:500px;border:0;border-radius:10px;"></iframe>
    </div>
  `;
  document.body.appendChild(mapPopup);
  mapPopup.style.display = "flex";
  setTimeout(() => mapPopup.classList.add("show"), 10);

  let ignoreNextClick = false;
  const closeMapOnOutside = (e) => {
    if(!e.target.closest('.popup-content')){
      e.stopPropagation();
      mapPopup.remove();

      ignoreNextClick = true;
      setTimeout(() => ignoreNextClick = false, 50);
    }
  };

  mapPopup.addEventListener('click', e => {
    if(ignoreNextClick) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    closeMapOnOutside(e);
  });

  mapPopup.addEventListener('touchstart', e => {
    if(ignoreNextClick) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    closeMapOnOutside(e);
  });

  const content = mapPopup.querySelector('.popup-content');
  if(content){
    content.addEventListener('click', e => e.stopPropagation());
    content.addEventListener('touchstart', e => e.stopPropagation());
  }
}

// ================= EVENT GENERATION =================
events.forEach(event => {
  // 갤러리 썸네일
  let img = document.createElement("img");
  img.src = event.img;
  img.className = "thumbnail";
  img.onclick = () => openPopup(event.id);
  gallery.appendChild(img);

  // 이벤트 팝업
  let popup = document.createElement("div");
  popup.className = "popup";
  popup.id = event.id;
  popup.innerHTML = `
    <div class="popup-content">
      <button class="close-btn" onclick="closePopup('${event.id}')">✖</button>
      <img src="${event.img}">
      <div class="info">
        <div class="lang en">${event.title.en}<br>Date: ${event.date.en}<br>Location: ${event.location.en}</div>
        <div class="lang jp">${event.title.jp}<br>日付: ${event.date.jp}<br>場所: ${event.location.jp}</div>
        <div class="lang cn">${event.title.cn}<br>日期: ${event.date.cn}<br>地点: ${event.location.cn}</div>
        <div class="action-buttons">
          <button onclick="openMap('${event.map}')">📍 MAP</button>
          <button onclick="openQR('${event.id}qr')">📱 QR</button>
        </div>
      </div>
    </div>
  `;
  popupContainer.appendChild(popup);

  // 이벤트 QR 팝업
  let qr = document.createElement("div");
  qr.className = "qr-popup";
  qr.id = event.id + "qr";
  qr.innerHTML = `
    <div class="qr-box">
      <div class="qr-close" onclick="closeQR('${event.id}qr')">✖</div>
      <img src="${event.qr}">
    </div>
  `;
  qrContainer.appendChild(qr);
});

// ================= EASTER EGG =================
let logoClickCount = 0;
titleEl.addEventListener("click", () => {
  logoClickCount++;
  if(logoClickCount >= 5){
    let audio = document.getElementById("secretAudio");
    if(audio) audio.play();
    openPopup("creatorPopup");
    logoClickCount = 0;
  }
  setTimeout(() => logoClickCount = 0, 2000);
});

// ================= POPUP & QR BACKGROUND CLICK (모바일 안전) =================
let ignoreNextClick = false;

document.querySelectorAll('.popup, .qr-popup').forEach(popup => {
  const closeOnOutside = (e) => {
    if(!e.target.closest('.popup-content') && !e.target.closest('.qr-box')){
      e.stopPropagation();
      if(popup.classList.contains('qr-popup')){
        closeQR(popup.id);
      } else {
        closePopup(popup.id);
      }

      ignoreNextClick = true;
      setTimeout(() => ignoreNextClick = false, 50);
    }
  };

  popup.addEventListener('click', e => {
    if(ignoreNextClick) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    closeOnOutside(e);
  });

  popup.addEventListener('touchstart', e => {
    if(ignoreNextClick) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    closeOnOutside(e);
  });

  const content = popup.querySelector('.popup-content') || popup.querySelector('.qr-box');
  if(content){
    content.addEventListener('click', e => e.stopPropagation());
    content.addEventListener('touchstart', e => e.stopPropagation());
  }
});

// ================= INIT =================
window.onload = () => setLang("en");
