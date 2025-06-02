// 토글 스위치 기능
document.querySelectorAll(".toggle-switch").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
  });
});

// 메뉴 선택 기능
document.querySelectorAll(".menu-item").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelector(".menu-item.active").classList.remove("active");
    item.classList.add("active");

    // 메뉴별 내용 변경 (예시)
    const title = item.querySelector(".menu-title").textContent;
    document.querySelector(".settings-header h1").textContent = title;
  });
});

// 모달 관련 요소들
const deleteAccountBtn = document.getElementById("deleteAccountBtn");
const deleteModal = document.getElementById("deleteModal");
const cancelBtn = document.getElementById("cancelBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const confirmationInput = document.getElementById("confirmationInput");
const errorMessage = document.getElementById("errorMessage");

// 계정 삭제 버튼 클릭시 모달 열기
deleteAccountBtn.addEventListener("click", () => {
  deleteModal.classList.add("active");
  document.body.style.overflow = "hidden"; // 배경 스크롤 방지
});

// 모달 닫기 함수
function closeModal() {
  deleteModal.classList.remove("active");
  document.body.style.overflow = "auto"; // 스크롤 복원
  confirmationInput.value = "";
  confirmationInput.classList.remove("error");
  errorMessage.style.display = "none";
  confirmDeleteBtn.disabled = true;
}

// 취소 버튼 클릭시 모달 닫기
cancelBtn.addEventListener("click", closeModal);

// 모달 오버레이 클릭시 모달 닫기
deleteModal.addEventListener("click", (e) => {
  if (e.target === deleteModal) {
    closeModal();
  }
});

// ESC 키로 모달 닫기
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && deleteModal.classList.contains("active")) {
    closeModal();
  }
});

// 확인 입력 검증
confirmationInput.addEventListener("input", () => {
  const inputValue = confirmationInput.value.trim();
  const correctText = "계정삭제";

  if (inputValue === correctText) {
    confirmationInput.classList.remove("error");
    errorMessage.style.display = "none";
    confirmDeleteBtn.disabled = false;
  } else {
    confirmDeleteBtn.disabled = true;
    if (inputValue.length > 0) {
      confirmationInput.classList.add("error");
      errorMessage.style.display = "block";
    } else {
      confirmationInput.classList.remove("error");
      errorMessage.style.display = "none";
    }
  }
});

// 최종 삭제 확인 (실제 삭제 기능은 나중에 구현)
confirmDeleteBtn.addEventListener("click", () => {
  alert("계정 삭제가 완료되었습니다. (실제로는 삭제되지 않았습니다)");
  closeModal();
});
