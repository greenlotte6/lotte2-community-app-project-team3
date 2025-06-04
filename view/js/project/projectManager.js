// ========================================
// 통합된 프로젝트 관리 시스템
// ========================================

// 전역 변수들
let invitedMembers = [];
let currentEditingProject = null;

// 프로젝트 타입별 아이콘 클래스
const typeIconClasses = {
  web: "type-web",
  mobile: "type-mobile",
  design: "type-design",
  data: "type-data",
  ai: "type-ai",
  other: "",
};

// 프로젝트 타입별 이름 매핑
const typeNames = {
  web: "웹 개발",
  mobile: "모바일",
  design: "디자인",
  data: "데이터",
  ai: "AI/ML",
  other: "기타",
};

// 역방향 타입 매핑 (편집용)
const projectTypes = {
  "웹 개발": "web",
  모바일: "mobile",
  디자인: "design",
  데이터: "data",
  "AI/ML": "ai",
  기타: "other",
};

// DOM 요소들
let elements = {};

// DOM 요소 초기화
function initializeElements() {
  // 프로젝트 생성 모달 관련
  elements.newProjectBtn = document.querySelector(".new-project-btn");
  elements.projectModal = document.getElementById("projectModal");
  elements.cancelProjectBtn = document.getElementById("cancelProjectBtn");
  elements.createProjectBtn = document.getElementById("createProjectBtn");
  elements.projectNameInput = document.getElementById("projectName");
  elements.projectDescriptionInput =
    document.getElementById("projectDescription");
  elements.projectsContainer = document.getElementById("projectsContainer");
  elements.memberEmailInput = document.getElementById("memberEmail");
  elements.addMemberBtn = document.getElementById("addMemberBtn");
  elements.invitedMembersContainer = document.getElementById("invitedMembers");
  elements.inviteBtn = document.querySelector(".invite-btn");

  // 편집 모달 관련
  elements.editModal = document.getElementById("editModal");
  elements.editProjectName = document.getElementById("editProjectName");
  elements.editProjectDescription = document.getElementById(
    "editProjectDescription"
  );
  elements.cancelEditBtn = document.getElementById("cancelEditBtn");
  elements.saveEditBtn = document.getElementById("saveEditBtn");

  // 공통 요소들
  elements.createTypeOptions =
    elements.projectModal.querySelectorAll(".type-option");
  elements.editTypeOptions =
    elements.editModal.querySelectorAll(".type-option");
}

// ========================================
// 유틸리티 함수들
// ========================================

// 현재 날짜 가져오기
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

// 이메일 유효성 검사
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ========================================
// 프로젝트 생성 기능
// ========================================

// 모달 열기
function openCreateModal() {
  elements.projectModal.classList.add("active");
  document.body.style.overflow = "hidden";
  resetCreateForm();
}

// 모달 닫기
function closeCreateModal() {
  elements.projectModal.classList.remove("active");
  document.body.style.overflow = "auto";
  resetCreateForm();
}

// 생성 폼 초기화
function resetCreateForm() {
  elements.projectNameInput.value = "";
  elements.projectDescriptionInput.value = "";
  elements.memberEmailInput.value = "";
  invitedMembers = [];
  updateInvitedMembersDisplay();

  // 타입 선택 초기화
  elements.createTypeOptions.forEach((option) => {
    option.classList.remove("selected");
  });

  updateCreateButtonState();
}

// 생성 버튼 상태 업데이트
function updateCreateButtonState() {
  const hasName = elements.projectNameInput.value.trim().length > 0;
  const hasSelectedType =
    elements.projectModal.querySelector(".type-option.selected") !== null;
  elements.createProjectBtn.disabled = !(hasName && hasSelectedType);
}

// 초대된 멤버 화면 업데이트
function updateInvitedMembersDisplay() {
  if (invitedMembers.length === 0) {
    elements.invitedMembersContainer.innerHTML = `
      <div class="empty-members">
        아직 초대된 멤버가 없습니다.<br />
        이메일을 입력하여 팀원을 초대해보세요.
      </div>
    `;
  } else {
    elements.invitedMembersContainer.innerHTML = invitedMembers
      .map(
        (email) => `
      <div class="member-tag">
        <span>${email}</span>
        <button class="member-remove" onclick="removeMember('${email}')">×</button>
      </div>
    `
      )
      .join("");
  }
}

// 멤버 제거
function removeMember(email) {
  invitedMembers = invitedMembers.filter((member) => member !== email);
  updateInvitedMembersDisplay();
}

// 멤버 추가
function addMember() {
  const email = elements.memberEmailInput.value.trim();

  if (!email) {
    alert("이메일을 입력해주세요.");
    return;
  }

  if (!isValidEmail(email)) {
    alert("올바른 이메일 형식을 입력해주세요.");
    return;
  }

  if (invitedMembers.includes(email)) {
    alert("이미 초대된 멤버입니다.");
    return;
  }

  invitedMembers.push(email);
  elements.memberEmailInput.value = "";
  updateInvitedMembersDisplay();
}

// 프로젝트 생성
function createProject() {
  const projectName = elements.projectNameInput.value.trim();
  const projectDescription =
    elements.projectDescriptionInput.value.trim() || "설명이 없습니다.";
  const selectedType = elements.projectModal.querySelector(
    ".type-option.selected"
  );

  if (!projectName) {
    alert("프로젝트 이름을 입력해주세요.");
    elements.projectNameInput.focus();
    return;
  }

  if (!selectedType) {
    alert("프로젝트 타입을 선택해주세요.");
    return;
  }

  const projectType = selectedType.dataset.type;
  const projectTypeName = typeNames[projectType];
  const iconClass = typeIconClasses[projectType];
  const projectIcon = projectName.charAt(0).toUpperCase();
  const currentDate = getCurrentDate();

  // 새 프로젝트 아이템 생성
  const newProjectItem = document.createElement("div");
  newProjectItem.className = "project-item";
  newProjectItem.innerHTML = `
    <div class="project-icon ${iconClass}">${projectIcon}</div>
    <div class="project-info">
      <div class="project-name">${projectName}</div>
      <div class="project-details">
        <span class="project-type">${projectTypeName}</span>
        <span class="project-date">${currentDate}</span>
      </div>
      <div class="project-description">
        ${projectDescription}
      </div>
    </div>
    <div class="project-actions">
      <button class="action-btn edit-btn" title="편집">✏️</button>
      <button class="action-btn delete-btn" title="삭제">🗑️</button>
    </div>
  `;

  // 프로젝트 목록 맨 위에 추가
  elements.projectsContainer.insertBefore(
    newProjectItem,
    elements.projectsContainer.firstChild
  );

  // 새로 생성된 프로젝트에 이벤트 리스너 추가
  addProjectEventListeners(newProjectItem);

  // 성공 메시지
  let successMessage = `"${projectName}" 프로젝트가 성공적으로 생성되었습니다!`;
  if (invitedMembers.length > 0) {
    successMessage += `\n초대된 멤버: ${invitedMembers.join(", ")}`;
  }
  alert(successMessage);

  closeCreateModal();
}

// ========================================
// 프로젝트 편집 기능
// ========================================

// 편집 모달 열기
function openEditModal(projectItem) {
  currentEditingProject = projectItem;

  // 현재 프로젝트 정보 가져오기
  const projectName = projectItem.querySelector(".project-name").textContent;
  const projectDescription = projectItem.querySelector(
    ".project-description"
  ).textContent;
  const projectType = projectItem.querySelector(".project-type").textContent;

  // 모달에 현재 정보 설정
  elements.editProjectName.value = projectName;
  elements.editProjectDescription.value = projectDescription;

  // 프로젝트 타입 선택 초기화
  elements.editTypeOptions.forEach((option) => {
    option.classList.remove("selected");
    if (option.dataset.type === projectTypes[projectType]) {
      option.classList.add("selected");
    }
  });

  // 모달 열기
  elements.editModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

// 편집 모달 닫기
function closeEditModal() {
  elements.editModal.classList.remove("active");
  document.body.style.overflow = "auto";
  currentEditingProject = null;
}

// 편집 내용 저장
function saveEdit() {
  if (!currentEditingProject) return;

  const newName = elements.editProjectName.value.trim();
  const newDescription = elements.editProjectDescription.value.trim();
  const selectedType = elements.editModal.querySelector(
    ".type-option.selected"
  );

  if (!newName) {
    alert("프로젝트 이름을 입력해주세요.");
    elements.editProjectName.focus();
    return;
  }

  if (!selectedType) {
    alert("프로젝트 타입을 선택해주세요.");
    return;
  }

  // 프로젝트 정보 업데이트
  currentEditingProject.querySelector(".project-name").textContent = newName;
  currentEditingProject.querySelector(".project-description").textContent =
    newDescription || "설명이 없습니다.";
  currentEditingProject.querySelector(".project-type").textContent =
    typeNames[selectedType.dataset.type];

  // 아이콘 업데이트
  const projectIcon = currentEditingProject.querySelector(".project-icon");
  projectIcon.className = `project-icon ${
    typeIconClasses[selectedType.dataset.type]
  }`;
  projectIcon.textContent = newName.charAt(0).toUpperCase();

  alert("프로젝트가 성공적으로 수정되었습니다!");
  closeEditModal();
}

// ========================================
// 프로젝트 아이템 이벤트 리스너
// ========================================

function addProjectEventListeners(projectItem) {
  // 편집 버튼 이벤트
  const editBtn = projectItem.querySelector(".edit-btn");
  editBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    openEditModal(projectItem);
  });

  // 삭제 버튼 이벤트
  const deleteBtn = projectItem.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    const projectName = projectItem.querySelector(".project-name").textContent;
    if (confirm(`"${projectName}"을(를) 정말 삭제하시겠습니까?`)) {
      projectItem.remove();
      alert(`"${projectName}" 프로젝트가 삭제되었습니다.`);
    }
  });

  // 프로젝트 클릭 이벤트 (선택)
  projectItem.addEventListener("click", function (e) {
    if (!e.target.closest(".project-actions")) {
      // 모든 프로젝트에서 selected 클래스 제거
      document.querySelectorAll(".project-item").forEach((item) => {
        item.classList.remove("selected");
      });
      // 현재 프로젝트에 selected 클래스 추가
      this.classList.add("selected");
    }
  });
}

// ========================================
// 이벤트 리스너 초기화
// ========================================

function initializeEventListeners() {
  // 프로젝트 생성 관련 이벤트
  elements.newProjectBtn.addEventListener("click", openCreateModal);
  elements.cancelProjectBtn.addEventListener("click", closeCreateModal);
  elements.createProjectBtn.addEventListener("click", createProject);
  elements.addMemberBtn.addEventListener("click", addMember);

  // 생성 모달 프로젝트 타입 선택
  elements.createTypeOptions.forEach((option) => {
    option.addEventListener("click", function () {
      elements.createTypeOptions.forEach((opt) =>
        opt.classList.remove("selected")
      );
      this.classList.add("selected");
      updateCreateButtonState();
    });
  });

  // 편집 모달 프로젝트 타입 선택
  elements.editTypeOptions.forEach((option) => {
    option.addEventListener("click", function () {
      elements.editTypeOptions.forEach((opt) =>
        opt.classList.remove("selected")
      );
      this.classList.add("selected");
    });
  });

  // 편집 모달 관련 이벤트
  elements.cancelEditBtn.addEventListener("click", closeEditModal);
  elements.saveEditBtn.addEventListener("click", saveEdit);

  // 모달 배경 클릭으로 닫기
  elements.projectModal.addEventListener("click", function (e) {
    if (e.target === elements.projectModal) {
      closeCreateModal();
    }
  });

  elements.editModal.addEventListener("click", function (e) {
    if (e.target === elements.editModal) {
      closeEditModal();
    }
  });

  // ESC 키로 모달 닫기
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (elements.projectModal.classList.contains("active")) {
        closeCreateModal();
      } else if (elements.editModal.classList.contains("active")) {
        closeEditModal();
      }
    }
  });

  // 입력 필드 변경 시 버튼 상태 업데이트
  elements.projectNameInput.addEventListener("input", updateCreateButtonState);

  // Enter 키로 멤버 추가
  elements.memberEmailInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addMember();
    }
  });

  // 초대 링크 생성
  elements.inviteBtn.addEventListener("click", function () {
    const inviteLink = `https://yourapp.com/invite/${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(inviteLink).then(() => {
        alert(`초대 링크가 클립보드에 복사되었습니다!\n${inviteLink}`);
      });
    } else {
      alert(`초대 링크: ${inviteLink}`);
    }
  });

  // 기존 프로젝트들에 이벤트 리스너 추가
  document.querySelectorAll(".project-item").forEach(addProjectEventListeners);
}

// ========================================
// 초기화
// ========================================

document.addEventListener("DOMContentLoaded", function () {
  initializeElements();
  initializeEventListeners();
  updateInvitedMembersDisplay();
});
