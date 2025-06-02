// 모달 요소들
const newProjectBtn = document.querySelector(".new-project-btn");
const projectModal = document.getElementById("projectModal");
const cancelProjectBtn = document.getElementById("cancelProjectBtn");
const createProjectBtn = document.getElementById("createProjectBtn");

// 모달 열기
newProjectBtn.addEventListener("click", function () {
  projectModal.classList.add("active");
  document.body.style.overflow = "hidden"; // 배경 스크롤 방지
});

// 모달 닫기 함수
function closeModal() {
  projectModal.classList.remove("active");
  document.body.style.overflow = "auto"; // 스크롤 복원
}

// 취소 버튼으로 모달 닫기
cancelProjectBtn.addEventListener("click", closeModal);

// 배경 클릭으로 모달 닫기
projectModal.addEventListener("click", function (e) {
  if (e.target === projectModal) {
    closeModal();
  }
});

// ESC 키로 모달 닫기
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && projectModal.classList.contains("active")) {
    closeModal();
  }
});

// 생성 버튼 클릭 (임시)
createProjectBtn.addEventListener("click", function () {
  alert("프로젝트 생성 기능 - 추후 구현 예정");
  closeModal();
});
