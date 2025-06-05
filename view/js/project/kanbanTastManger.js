// ========================================
// 칸반보드 편집 및 추가 시스템 (완전 통합)
// ========================================

// 전역 변수들
let currentEditingTask = null;
let currentTargetColumn = null;
let taskIdCounter = 100; // 새 작업 ID용

// DOM 요소들 - 편집 모달
const editTaskModal = document.getElementById("editTaskModal");
const editTaskTitle = document.getElementById("editTaskTitle");
const editTaskDescription = document.getElementById("editTaskDescription");
const editTaskPriority = document.getElementById("editTaskPriority");
const editTaskAssignee = document.getElementById("editTaskAssignee");
const editTaskTag = document.getElementById("editTaskTag");
const editTaskDate = document.getElementById("editTaskDate");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const saveEditBtn = document.getElementById("saveEditBtn");
const deleteTaskBtn = document.getElementById("deleteTaskBtn");

// DOM 요소들 - 추가 모달 (기존 taskModal을 addTaskModal로 변경)
const addTaskModal =
  document.getElementById("addTaskModal") ||
  document.getElementById("taskModal");
const newTaskTitle =
  document.getElementById("newTaskTitle") ||
  document.getElementById("taskTitle");
const newTaskDescription =
  document.getElementById("newTaskDescription") ||
  document.getElementById("taskContent");
const cancelAddBtn =
  document.getElementById("cancelAddBtn") ||
  document.getElementById("cancelTaskBtn");
const saveAddBtn =
  document.getElementById("saveAddBtn") ||
  document.getElementById("saveTaskBtn");

// 작업 우선순위 배열
const priorities = ["high", "medium", "low"];
const priorityNames = {
  high: "높음",
  medium: "중간",
  low: "낮음",
};

// 담당자 목록
const assignees = [
  { name: "김", avatar: "김" },
  { name: "이", avatar: "이" },
  { name: "박", avatar: "박" },
  { name: "최", avatar: "최" },
  { name: "정", avatar: "정" },
  { name: "한", avatar: "한" },
];

// 태그 목록 및 매핑
const tags = [
  { name: "Frontend", class: "frontend" },
  { name: "Backend", class: "backend" },
  { name: "Design", class: "design" },
  { name: "Testing", class: "" },
  { name: "Documentation", class: "" },
  { name: "Bug Fix", class: "" },
];

const tagClasses = {
  frontend: "frontend",
  backend: "backend",
  design: "design",
  testing: "",
  documentation: "",
  bugfix: "",
};

const tagNames = {
  frontend: "Frontend",
  backend: "Backend",
  design: "Design",
  testing: "Testing",
  documentation: "Documentation",
  bugfix: "Bug Fix",
};

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
  futureDate.setDate(today.getDate() + Math.floor(Math.random() * 14) + 1);
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
// 편집 모달 관리
// ========================================

function openEditModal(taskCard) {
  if (!editTaskModal) {
    alert("편집 모달을 찾을 수 없습니다. HTML에 editTaskModal을 추가해주세요.");
    return;
  }

  currentEditingTask = taskCard;

  // 현재 작업 정보 가져오기
  const title = taskCard.querySelector(".task-title").textContent;
  const description = taskCard.querySelector(".task-description").textContent;
  const assignee = taskCard.querySelector(".assignee-avatar").textContent;
  const date = taskCard.querySelector(".task-date").textContent;

  // 우선순위 추출
  let priority = "medium";
  if (taskCard.classList.contains("priority-high")) priority = "high";
  else if (taskCard.classList.contains("priority-low")) priority = "low";

  // 태그 추출
  const tagElement = taskCard.querySelector(".task-tag");
  let tag = "frontend";
  if (tagElement) {
    if (tagElement.classList.contains("frontend")) tag = "frontend";
    else if (tagElement.classList.contains("backend")) tag = "backend";
    else if (tagElement.classList.contains("design")) tag = "design";
    else tag = "testing";
  }

  // 모달에 정보 설정
  editTaskTitle.value = title;
  editTaskDescription.value =
    description === "설명이 없습니다." ? "" : description;
  if (editTaskPriority) editTaskPriority.value = priority;
  if (editTaskAssignee) editTaskAssignee.value = assignee;
  if (editTaskTag) editTaskTag.value = tag;
  if (editTaskDate) editTaskDate.value = date;

  // 모달 열기
  editTaskModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeEditModal() {
  if (editTaskModal) {
    editTaskModal.classList.remove("active");
    document.body.style.overflow = "auto";
    currentEditingTask = null;
  }
}

function saveTaskEdit() {
  if (!currentEditingTask) return;

  const title = editTaskTitle.value.trim();
  const description = editTaskDescription.value.trim();
  const priority = editTaskPriority ? editTaskPriority.value : "medium";
  const assignee = editTaskAssignee ? editTaskAssignee.value : "김";
  const tag = editTaskTag ? editTaskTag.value : "frontend";
  const date = editTaskDate ? editTaskDate.value.trim() : getRandomDate();

  if (!title) {
    alert("작업 제목을 입력해주세요.");
    editTaskTitle.focus();
    return;
  }

  // 작업 카드 업데이트
  currentEditingTask.querySelector(".task-title").textContent = title;
  currentEditingTask.querySelector(".task-description").textContent =
    description || "설명이 없습니다.";
  currentEditingTask.querySelector(".assignee-avatar").textContent = assignee;
  currentEditingTask.querySelector(".task-date").textContent = date;

  // 우선순위 클래스 업데이트
  currentEditingTask.className = `task-card priority-${priority}`;
  if (currentEditingTask.getAttribute("data-task-id")) {
    currentEditingTask.setAttribute(
      "data-task-id",
      currentEditingTask.getAttribute("data-task-id")
    );
  }

  // 태그 업데이트
  const tagElement = currentEditingTask.querySelector(".task-tag");
  if (tagElement) {
    tagElement.textContent = tagNames[tag] || tag;
    tagElement.className = "task-tag " + (tagClasses[tag] || "");
  }

  alert("작업이 성공적으로 수정되었습니다!");
  closeEditModal();
}

function deleteTask() {
  if (!currentEditingTask) return;

  const taskTitle = currentEditingTask.querySelector(".task-title").textContent;
  if (confirm(`"${taskTitle}" 작업을 정말 삭제하시겠습니까?`)) {
    const column = currentEditingTask.closest(".kanban-column");
    currentEditingTask.remove();
    updateTaskCount(column);
    alert("작업이 삭제되었습니다.");
    closeEditModal();
  }
}

// ========================================
// 새 작업 추가 모달 관리
// ========================================

function openAddModal(targetColumn = null) {
  if (!addTaskModal) {
    alert("추가 모달을 찾을 수 없습니다.");
    return;
  }

  currentTargetColumn =
    targetColumn || document.querySelector(".kanban-column.todo");

  // 입력 필드 초기화
  if (newTaskTitle) newTaskTitle.value = "";
  if (newTaskDescription) newTaskDescription.value = "";
  if (saveAddBtn) saveAddBtn.disabled = true;

  // 모달 열기
  addTaskModal.classList.add("active");
  document.body.style.overflow = "hidden";

  setTimeout(() => {
    if (newTaskTitle) newTaskTitle.focus();
  }, 100);
}

function closeAddModal() {
  if (addTaskModal) {
    addTaskModal.classList.remove("active");
    document.body.style.overflow = "auto";
    currentTargetColumn = null;
  }
}

function updateAddButtonState() {
  if (newTaskTitle && saveAddBtn) {
    const hasTitle = newTaskTitle.value.trim().length > 0;
    saveAddBtn.disabled = !hasTitle;
  }
}

// ========================================
// 작업 카드 생성 및 추가
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
  taskCard.setAttribute("data-task-id", taskIdCounter++);

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

  // 클릭 이벤트 추가 (편집용)
  taskCard.addEventListener("click", function () {
    openEditModal(this);
  });

  return taskCard;
}

function addNewTask() {
  if (!newTaskTitle) return;

  const title = newTaskTitle.value.trim();
  const description = newTaskDescription ? newTaskDescription.value.trim() : "";

  if (!title) {
    alert("작업 제목을 입력해주세요.");
    newTaskTitle.focus();
    return;
  }

  // 대상 컬럼 결정
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

  closeAddModal();
}

// ========================================
// 기존 작업 상세보기 (편집 모달이 없을 때 대체)
// ========================================

function showTaskDetails(taskCard) {
  // 편집 모달이 있으면 편집 모달을 열고, 없으면 상세보기
  if (editTaskModal) {
    openEditModal(taskCard);
    return;
  }

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

편집 모달이 추가되면 더 자세한 편집이 가능합니다.
  `;

  alert(details);
}

// ========================================
// 검색 기능
// ========================================

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

// ========================================
// 이벤트 리스너 초기화
// ========================================

function initializeEventListeners() {
  // 기존 작업 카드 클릭 이벤트
  document.querySelectorAll(".task-card").forEach((card) => {
    card.addEventListener("click", function () {
      if (editTaskModal) {
        openEditModal(this);
      } else {
        showTaskDetails(this);
      }
    });
  });

  // 새 작업 추가 버튼들
  document.querySelectorAll(".add-task-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const column = this.closest(".kanban-column");
      openAddModal(column);
    });
  });

  // 헤더의 추가 버튼
  const headerAddBtn = document.querySelector(".add-btn");
  if (headerAddBtn) {
    headerAddBtn.addEventListener("click", function () {
      openAddModal();
    });
  }

  // 편집 모달 이벤트들
  if (cancelEditBtn) cancelEditBtn.addEventListener("click", closeEditModal);
  if (saveEditBtn) saveEditBtn.addEventListener("click", saveTaskEdit);
  if (deleteTaskBtn) deleteTaskBtn.addEventListener("click", deleteTask);

  // 추가 모달 이벤트들
  if (cancelAddBtn) cancelAddBtn.addEventListener("click", closeAddModal);
  if (saveAddBtn) saveAddBtn.addEventListener("click", addNewTask);
  if (newTaskTitle)
    newTaskTitle.addEventListener("input", updateAddButtonState);

  // 모달 배경 클릭으로 닫기
  if (editTaskModal) {
    editTaskModal.addEventListener("click", function (e) {
      if (e.target === editTaskModal) {
        closeEditModal();
      }
    });
  }

  if (addTaskModal) {
    addTaskModal.addEventListener("click", function (e) {
      if (e.target === addTaskModal) {
        closeAddModal();
      }
    });
  }

  // ESC 키로 모달 닫기
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (editTaskModal && editTaskModal.classList.contains("active")) {
        closeEditModal();
      } else if (addTaskModal && addTaskModal.classList.contains("active")) {
        closeAddModal();
      }
    }
  });

  // Enter 키로 빠른 저장
  if (newTaskTitle) {
    newTaskTitle.addEventListener("keypress", function (e) {
      if (e.key === "Enter" && saveAddBtn && !saveAddBtn.disabled) {
        addNewTask();
      }
    });
  }

  if (editTaskTitle) {
    editTaskTitle.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        saveTaskEdit();
      }
    });
  }

  // 검색 기능
  const searchBtn = document.querySelector(".search-btn");
  if (searchBtn) {
    searchBtn.addEventListener("click", function () {
      const searchTerm = prompt("검색할 작업명을 입력하세요:");
      if (searchTerm) {
        searchTasks(searchTerm);
      }
    });
  }
}

// ========================================
// 초기화
// ========================================

document.addEventListener("DOMContentLoaded", function () {
  initializeEventListeners();
  console.log("칸반보드 편집 및 추가 시스템이 초기화되었습니다.");

  // 기존 작업 카드들에 data-task-id 추가 (없는 경우)
  document.querySelectorAll(".task-card").forEach((card, index) => {
    if (!card.getAttribute("data-task-id")) {
      card.setAttribute("data-task-id", index + 1);
    }
  });
});
