// ========================================
// 칸반보드 작업 추가 시스템
// ========================================

// 전역 변수들
let currentTargetColumn = null; // 현재 작업을 추가할 컬럼

// DOM 요소들
const taskModal = document.getElementById("taskModal");
const cancelTaskBtn = document.getElementById("cancelTaskBtn");
const saveTaskBtn = document.getElementById("saveTaskBtn");
const taskTitleInput = document.getElementById("taskTitle");
const taskContentInput = document.getElementById("taskContent");

// 작업 우선순위 배열 (랜덤 할당용)
const priorities = ["high", "medium", "low"];
const priorityNames = {
  high: "높음",
  medium: "중간",
  low: "낮음",
};

// 담당자 목록 (랜덤 할당용)
const assignees = [
  { name: "김", avatar: "김" },
  { name: "이", avatar: "이" },
  { name: "박", avatar: "박" },
  { name: "최", avatar: "최" },
  { name: "정", avatar: "정" },
  { name: "한", avatar: "한" },
];

// 태그 목록 (랜덤 할당용)
const tags = [
  { name: "Frontend", class: "frontend" },
  { name: "Backend", class: "backend" },
  { name: "Design", class: "design" },
  { name: "Testing", class: "" },
  { name: "Documentation", class: "" },
  { name: "Bug Fix", class: "" },
];

// ========================================
// 유틸리티 함수들
// ========================================

// 랜덤 요소 선택
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// 현재 날짜에서 며칠 후 날짜 생성
function getRandomDate() {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + Math.floor(Math.random() * 14) + 1); // 1-14일 후

  const month = futureDate.getMonth() + 1;
  const day = futureDate.getDate();
  return `${month}/${day}`;
}

// 컬럼의 작업 수 업데이트
function updateTaskCount(column) {
  const taskCount = column.querySelector(".task-count");
  const taskCards = column.querySelectorAll(".task-card").length;
  taskCount.textContent = taskCards;
}

// ========================================
// 모달 관리 함수들
// ========================================

// 모달 열기
function openTaskModal(targetColumn = null) {
  currentTargetColumn = targetColumn;
  taskModal.classList.add("active");
  document.body.style.overflow = "hidden";

  // 입력 필드 초기화
  taskTitleInput.value = "";
  taskContentInput.value = "";
  saveTaskBtn.disabled = true;

  // 제목 입력 필드에 포커스
  setTimeout(() => {
    taskTitleInput.focus();
  }, 100);
}

// 모달 닫기
function closeTaskModal() {
  taskModal.classList.remove("active");
  document.body.style.overflow = "auto";
  currentTargetColumn = null;

  // 입력 필드 초기화
  taskTitleInput.value = "";
  taskContentInput.value = "";
}

// 저장 버튼 상태 업데이트
function updateSaveButtonState() {
  const hasTitle = taskTitleInput.value.trim().length > 0;
  saveTaskBtn.disabled = !hasTitle;
}

// ========================================
// 작업 카드 생성 함수
// ========================================

function createTaskCard(title, description) {
  // 랜덤 속성들 생성
  const priority = getRandomElement(priorities);
  const assignee = getRandomElement(assignees);
  const taskTag = getRandomElement(tags);
  const dueDate = getRandomDate();

  // 작업 카드 요소 생성
  const taskCard = document.createElement("div");
  taskCard.className = `task-card priority-${priority}`;

  taskCard.innerHTML = `
    <div class="task-title">${title}</div>
    <div class="task-description">
      ${description || "설명이 없습니다."}
    </div>
    <div class="task-meta">
      <div class="task-tags">
        <span class="task-tag ${taskTag.class}">${taskTag.name}</span>
      </div>
      <div class="task-assignee">
        <div class="assignee-avatar">${assignee.avatar}</div>
        <span class="task-date">${dueDate}</span>
      </div>
    </div>
  `;

  // 클릭 이벤트 추가 (작업 상세보기용)
  taskCard.addEventListener("click", function () {
    showTaskDetails(this);
  });

  // 드래그 앤 드롭 이벤트 추가 (향후 구현용)
  taskCard.draggable = true;
  taskCard.addEventListener("dragstart", function (e) {
    e.dataTransfer.setData("text/plain", "");
    this.style.opacity = "0.5";
  });

  taskCard.addEventListener("dragend", function () {
    this.style.opacity = "1";
  });

  return taskCard;
}

// ========================================
// 작업 추가 함수
// ========================================

function addNewTask() {
  const title = taskTitleInput.value.trim();
  const description = taskContentInput.value.trim();

  if (!title) {
    alert("작업 제목을 입력해주세요.");
    taskTitleInput.focus();
    return;
  }

  // 대상 컬럼 결정 (지정되지 않았으면 첫 번째 컬럼)
  let targetColumn = currentTargetColumn;
  if (!targetColumn) {
    targetColumn = document.querySelector(".kanban-column.todo");
  }

  // 새 작업 카드 생성
  const newTaskCard = createTaskCard(title, description);

  // 작업 목록에 추가
  const taskList = targetColumn.querySelector(".task-list");
  taskList.appendChild(newTaskCard);

  // 작업 수 업데이트
  updateTaskCount(targetColumn);

  // 애니메이션 효과
  newTaskCard.style.opacity = "0";
  newTaskCard.style.transform = "translateY(-20px)";

  setTimeout(() => {
    newTaskCard.style.transition = "all 0.3s ease";
    newTaskCard.style.opacity = "1";
    newTaskCard.style.transform = "translateY(0)";
  }, 10);

  // 성공 메시지
  const columnName = targetColumn.querySelector(".column-name").textContent;
  alert(`"${title}" 작업이 ${columnName} 컬럼에 추가되었습니다!`);

  // 모달 닫기
  closeTaskModal();
}

// ========================================
// 작업 상세보기 함수 (보너스 기능)
// ========================================

function showTaskDetails(taskCard) {
  const title = taskCard.querySelector(".task-title").textContent;
  const description = taskCard.querySelector(".task-description").textContent;
  const tag = taskCard.querySelector(".task-tag").textContent;
  const assignee = taskCard.querySelector(".assignee-avatar").textContent;
  const date = taskCard.querySelector(".task-date").textContent;
  const priority = taskCard.className.includes("priority-high")
    ? "높음"
    : taskCard.className.includes("priority-medium")
    ? "중간"
    : "낮음";

  const details = `
📝 작업: ${title}
📄 설명: ${description}
🏷️ 태그: ${tag}
👤 담당자: ${assignee}
📅 마감일: ${date}
⚡ 우선순위: ${priority}

이 작업을 편집하거나 다른 컬럼으로 이동하시겠습니까?
  `;

  if (confirm(details + "\n\n확인: 편집 / 취소: 닫기")) {
    // 편집 기능 (향후 구현)
    alert("작업 편집 기능은 향후 구현 예정입니다.");
  }
}

// ========================================
// 이벤트 리스너 초기화
// ========================================

function initializeEventListeners() {
  // 컬럼별 "새 작업 추가" 버튼들
  document.querySelectorAll(".add-task-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const column = this.closest(".kanban-column");
      openTaskModal(column);
    });
  });

  // 헤더의 추가 버튼 (기본적으로 To Do 컬럼에 추가)
  document.querySelector(".add-btn").addEventListener("click", function () {
    openTaskModal();
  });

  // 모달 닫기 이벤트들
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

  // 저장 버튼 클릭
  saveTaskBtn.addEventListener("click", addNewTask);

  // 입력 필드 변경 시 저장 버튼 상태 업데이트
  taskTitleInput.addEventListener("input", updateSaveButtonState);

  // Enter 키로 빠른 저장 (제목 입력 필드에서)
  taskTitleInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && !saveTaskBtn.disabled) {
      addNewTask();
    }
  });

  // 기존 작업 카드들에 클릭 이벤트 추가
  document.querySelectorAll(".task-card").forEach((card) => {
    card.addEventListener("click", function () {
      showTaskDetails(this);
    });
  });
}

// ========================================
// 초기화
// ========================================

document.addEventListener("DOMContentLoaded", function () {
  initializeEventListeners();
  console.log("칸반보드 작업 추가 시스템이 초기화되었습니다.");
});

// ========================================
// 추가 기능들 (보너스)
// ========================================

// 검색 기능 (헤더의 검색 버튼용)
document.querySelector(".search-btn").addEventListener("click", function () {
  const searchTerm = prompt("검색할 작업명을 입력하세요:");
  if (searchTerm) {
    searchTasks(searchTerm);
  }
});

function searchTasks(searchTerm) {
  const taskCards = document.querySelectorAll(".task-card");
  let foundCount = 0;

  taskCards.forEach((card) => {
    const title = card.querySelector(".task-title").textContent.toLowerCase();
    const description = card
      .querySelector(".task-description")
      .textContent.toLowerCase();

    if (
      title.includes(searchTerm.toLowerCase()) ||
      description.includes(searchTerm.toLowerCase())
    ) {
      card.style.border = "2px solid #ffc107";
      card.style.backgroundColor = "#fff3cd";
      foundCount++;
    } else {
      card.style.border = "";
      card.style.backgroundColor = "";
    }
  });

  if (foundCount > 0) {
    alert(`"${searchTerm}"와 관련된 작업 ${foundCount}개를 찾았습니다.`);
  } else {
    alert(`"${searchTerm}"와 관련된 작업을 찾을 수 없습니다.`);
  }

  // 3초 후 하이라이트 제거
  setTimeout(() => {
    taskCards.forEach((card) => {
      card.style.border = "";
      card.style.backgroundColor = "";
    });
  }, 3000);
}
