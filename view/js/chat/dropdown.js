// 드롭다운 기능 구현
const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

// 버튼 클릭 시 드롭다운 열기/닫기
dropdownBtn.addEventListener("click", function (e) {
  e.stopPropagation(); // 이벤트 버블링 방지
  dropdownMenu.classList.toggle("show");
});

// 다른 곳 클릭 시 드롭다운 닫기
document.addEventListener("click", function (e) {
  if (!dropdownMenu.contains(e.target) && !dropdownBtn.contains(e.target)) {
    dropdownMenu.classList.remove("show");
  }
});

// 드롭다운 메뉴 항목 클릭 시 처리
const dropdownItems = document.querySelectorAll(".dropdown-item");
dropdownItems.forEach((item) => {
  item.addEventListener("click", function () {
    const text = this.querySelector("span:last-child").textContent;
    alert(text + " 기능이 클릭되었습니다!");
    dropdownMenu.classList.remove("show");
  });
});
