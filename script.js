// 화면 전환 제어 함수
function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

// 1. 인트로 로딩: 페이지 실행 후 3초(3000ms) 뒤에 로그인 스크린으로 이동
window.onload = function() {
    setTimeout(() => {
        showScreen("login-screen");
    }, 3000);
};

// 2. 메인 화면으로 이동 (로그인 버튼 및 소셜 버튼 공통)
function goToMain() {
    showScreen("main-screen");
    renderNovels(); // 메인 화면 진입 시 소설 데이터 로드
}

/* ==========================================================================
   3. 소설 로컬 데이터 세팅 (DB 역할 대체)
   ========================================================================== */
// 💡 [표지 이미지 수정 가이드] 
// 같은 폴더에 이미지 파일(예: cover1.jpg)을 넣고 image: "cover1.jpg" 형태로 수정하시면 됩니다.
// 현재는 정상적인 테스트를 위해 무료 이미지 링크를 걸어둔 상태입니다.
const NOVEL_DATA = [
    {
        id: 1,
        title: "신화 속 전신이 되었다",
        author: "김작가",
        image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400", 
        summary: "평범한 대학생이었던 주인공, 눈을 떠보니 그리스 신화 속 몰락해 가던 전쟁의 신이 되어 있었다. 신들의 전쟁에서 살아남기 위한 그의 처절한 신화가 지금 시작된다."
    },
    {
        id: 2,
        title: "차원 이동자를 위한 가이드",
        author: "이작가",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400", 
        summary: "매일 수백 명이 실종되는 대한민국. 그들은 모두 다른 차원으로 떨어지고 있었다. 생존율 1%의 이세계에서 살아남은 마스터가 전해주는 베테랑 가이드북."
    },
    {
        id: 3,
        title: "나 혼자 탑 플레이어",
        author: "박작가",
        image: "https://images.unsplash.com/photo-1614849963640-9cc74b2a826f?w=400", 
        summary: "멸망 직전의 세계에 등장한 수수께끼의 탑. 모두가 절망에 빠졌을 때, 과거에서 회귀한 단 한 사람만이 숨겨진 히든 피스들을 독식하기 시작한다."
    },
    {
        id: 4,
        title: "마법학교의 시한부 천재",
        author: "최작가",
        image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400", 
        summary: "시한부 판정을 받은 마법 천재의 아카데미 생존기. 남은 시간은 단 1년, 죽기 전에 세상의 모든 금지된 마법의 진리를 파헤치기로 결심한다."
    }
];

// 화면에 소설 그리드 카드 그리기
function renderNovels() {
    const container = document.getElementById("novel-list-container");
    container.innerHTML = ""; // 초기화

    NOVEL_DATA.forEach(novel => {
        const card = document.createElement("div");
        card.className = "novel-card";
        card.onclick = () => openModal(novel); // 클릭 시 해당 소설 줄거리 모달 오픈

        card.innerHTML = `
            <div class="novel-cover">
                <img src="${novel.image}" alt="${novel.title} 표지">
            </div>
            <div class="novel-info">
                <div class="novel-title">${novel.title}</div>
                <div class="novel-author">${novel.author}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

/* ==========================================================================
   4. 줄거리 창(모달) 오픈 / 클로즈 제어
   ========================================================================== */
function openModal(novel) {
    document.getElementById("modal-img").src = novel.image;
    document.getElementById("modal-title").innerText = novel.title;
    document.getElementById("modal-author").innerText = novel.author;
    document.getElementById("modal-summary").innerText = novel.summary;
    
    document.getElementById("novel-modal").classList.add("active");
}

function closeModal() {
    document.getElementById("novel-modal").classList.remove("active");
}