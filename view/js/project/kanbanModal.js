// 모달 관련 요소들
const taskModal = document.getElementById("taskModal");
const cancelTaskBtn = document.getElementById("cancelTaskBtn");
const saveTaskBtn = document.getElementById("saveTaskBtn");
const taskTitleInput = document.getElementById("taskTitle");

// 모든 "새 작업 추가" 버튼에 이벤트 추가
document.querySelectorAll(".add-task-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    taskModal.classList.add("active");
    document.body.style.overflow = "hidden";
  });
});

// 헤더의 추가 버튼에도 이벤트 추가
document.querySelector(".add-btn").addEventListener("click", function () {
  taskModal.classList.add("active");
  document.body.style.overflow = "hidden";
});

// 모달 닫기 함수
function closeTaskModal() {
  taskModal.classList.remove("active");
  document.body.style.overflow = "auto";
  // 입력 필드 초기화
  taskTitleInput.value = "";
  document.getElementById("taskContent").value = "";
}

// 취소 버튼 클릭
cancelTaskBtn.addEventListener("click", closeTaskModal);

// 배경 클릭으로 모달 닫기
taskModal.addEventListener("click", function (e) {
  if (e.target === taskModal) {
    closeTaskModal();
  }
});

// ESC 키로 모달 닫기
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && taskModal.classList.contains("active")) {
    closeTaskModal();
  }
});

// 저장 버튼 클릭 (임시)
saveTaskBtn.addEventListener("click", function () {
  alert("작업 저장 기능 - 추후 구현 예정");
  closeTaskModal();
});
