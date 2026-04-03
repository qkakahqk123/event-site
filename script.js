<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Events & Exhibitions</title>
<link rel="stylesheet" href="style.css">
</head>

<body>

<div class="lang-bar">
<img src="us.png" class="flag" onclick="setLang('en')">
<img src="jp.png" class="flag" onclick="setLang('jp')">
<img src="cn.png" class="flag" onclick="setLang('cn')">
</div>

<h1 id="title">Events & Exhibitions</h1>

<div id="gallery" class="gallery"></div>
<div id="popupContainer"></div>
<div id="qrContainer"></div>

<!-- 고양이 QR -->
<div id="catQR" class="qr-popup">
<div class="qr-box">
<div class="qr-close" onclick="closeQR('catQR')">✖</div>
<h3>Feed the cats 🐱</h3>
<img src="ritoqr.jpg">
</div>
</div>

<div class="cat-button" onclick="openQR('catQR')">🐱</div>

<!-- 제작자 -->
<div id="creatorPopup" class="popup">
<div class="popup-content creator-box">
<button class="close-btn" onclick="closePopup('creatorPopup')">✖</button>
<img src="creator.jpg">
<h2>Secret Developer</h2>
<p>Made by RITO 😎</p>
</div>
</div>

<audio id="secretAudio" src="secret.mp3"></audio>
<audio id="catAudio" src="catmeow.mp3"></audio>

<script src="script.js"></script>
</body>
</html>
