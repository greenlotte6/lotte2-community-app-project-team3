document.addEventListener("DOMContentLoaded", function () {
  let folders = JSON.parse(localStorage.getItem("folders")) || [];
  let trash = JSON.parse(localStorage.getItem("trash")) || [];
  let renameIndex = null;
  let currentPath = "/";
  let sortKey = null;
  let sortAsc = true;

  const myList = document.getElementById("my-list");
  const sharedList = document.getElementById("shared-list");
  const recentList = document.getElementById("recent-list");
  const trashList = document.getElementById("trash-list");

  document.addEventListener("click", () => {
    document.querySelector(".dropdown-menu").style.display = "none";
  });

  window.openCreateFolderModal = function () {
    document.getElementById("folderModal").style.display = "flex";
    document.getElementById("folderNameInput").value = "";
    document.getElementById("folderNameInput").focus();
    document.querySelector(".dropdown-menu").style.display = "none";
  };

  window.uploadFolder = function () {
    alert("폴더 업로드 기능은 아직 지원되지 않습니다.");
    document.querySelector(".dropdown-menu").style.display = "none";
  };

  document
    .getElementById("trash-select-all")
    .addEventListener("change", (e) => {
      document.querySelectorAll(".select-trash").forEach((cb) => {
        cb.checked = e.target.checked;
      });
    });

  function renderFolders() {
    const activeTab = document.querySelector(".tab-content.active").id;
    let targetList = null;

    if (activeTab === "tab-my-drive") targetList = myList;
    else if (activeTab === "tab-shared-drive") targetList = sharedList;
    else if (activeTab === "tab-recent") targetList = recentList;
    else return;

    targetList.innerHTML = "";

    folders.forEach((folder, index) => {
      const tr = document.createElement("tr");
      tr.dataset.index = index;
      tr.innerHTML = `
        <td><input type="checkbox" class="select-folder" data-index="${index}"></td>
        <td><i class="fas fa-folder"></i></td>
        <td>${folder.name}</td>
        <td>-</td>
        <td>${folder.modifiedAt}</td>
        <td>-</td>
        <td>${folder.createdAt}</td>
      `;
      tr.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        showContextMenu(e.pageX, e.pageY, index);
      });
      targetList.appendChild(tr);
    });
  }

  function renderTrash() {
    trashList.innerHTML = "";
    trash.forEach((folder, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input type="checkbox" class="select-trash" data-index="${index}"></td>
        <td>${folder.name}</td>
        <td>${folder.createdAt}</td>
        <td><button onclick="restoreFromTrash(${index})" class="restore-btn">복원</button></td>
      `;
      trashList.appendChild(tr);
    });
  }

  const dropZone = document.getElementById("drop-zone");

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");

    const files = Array.from(e.dataTransfer.files);
    const now = new Date().toLocaleString();

    files.forEach((file) => {
      folders.push({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: "file",
        createdAt: now,
        modifiedAt: now,
        parentId: null,
      });
    });

    saveData();
    renderFolders();
  });

  const tabMap = {
    "⭐ 내 드라이브": "tab-my-drive",
    "공유 드라이브": "tab-shared-drive",
    "최근 사용": "tab-recent",
    "🗑️ 휴지통": "tab-trash",
  };

  document.querySelectorAll(".sidebar li").forEach((li) => {
    li.addEventListener("click", () => {
      document
        .querySelectorAll(".sidebar li")
        .forEach((el) => el.classList.remove("active"));
      li.classList.add("active");

      document
        .querySelectorAll(".tab-content")
        .forEach((tab) => tab.classList.remove("active"));

      const label = li.textContent.trim();
      const tabId = tabMap[label];

      if (tabId) {
        document.getElementById(tabId).classList.add("active");
        document.getElementById("main-title").textContent = label;

        if (label === "⭐ 내 드라이브") {
          currentPath = "/";
          document.getElementById("current-path").textContent = currentPath;
        }
      }

      const isTrash = tabId === "tab-trash";
      document.querySelector(".create-folder-btn").style.display = isTrash
        ? "none"
        : "inline-block";
      document.querySelector(".restore-selected-btn").style.display = isTrash
        ? "inline-block"
        : "none";

      renderFolders();
      renderTrash();
    });
  });

  document
    .querySelector(".create-folder-btn")
    .addEventListener("click", (e) => {
      e.stopPropagation();
      const menu = document.querySelector(".dropdown-menu");
      menu.style.display = menu.style.display === "block" ? "none" : "block";
    });

  window.closeModal = function () {
    document.getElementById("folderModal").style.display = "none";
  };

  window.addFolderFromModal = function () {
    const name = document.getElementById("folderNameInput").value.trim();
    if (!name) return alert("폴더명을 입력해주세요.");
    const exists = folders.some(
      (f) => f.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) return alert("이미 존재하는 폴더명입니다.");

    const now = new Date().toLocaleString();
    folders.push({ name, createdAt: now, modifiedAt: now });
    saveData();
    closeModal();
    renderFolders();
  };

  document.getElementById("select-all").addEventListener("change", (e) => {
    document.querySelectorAll(".select-folder").forEach((cb) => {
      cb.checked = e.target.checked;
    });
  });

  document
    .querySelector(".delete-selected-btn")
    .addEventListener("click", () => {
      const isTrash = document
        .getElementById("tab-trash")
        .classList.contains("active");
      if (isTrash) {
        const selected = Array.from(
          document.querySelectorAll(".select-trash:checked")
        ).map((cb) => Number(cb.dataset.index));
        if (selected.length === 0) return alert("삭제할 항목을 선택하세요.");
        trash = trash.filter((_, idx) => !selected.includes(idx));
        saveData();
        renderTrash();
      } else {
        const selected = Array.from(
          document.querySelectorAll(".select-folder:checked")
        ).map((cb) => Number(cb.dataset.index));
        if (selected.length === 0) return alert("삭제할 항목을 선택하세요.");
        selected.forEach((idx) => {
          if (folders[idx]) trash.push(folders[idx]);
        });
        folders = folders.filter((_, idx) => !selected.includes(idx));
        saveData();
        renderFolders();
        renderTrash();
      }
    });

  document
    .querySelector(".restore-selected-btn")
    .addEventListener("click", () => {
      const selected = Array.from(
        document.querySelectorAll(".select-trash:checked")
      ).map((cb) => Number(cb.dataset.index));
      if (selected.length === 0) return alert("복원할 항목을 선택하세요.");
      selected.forEach((idx) => {
        if (trash[idx]) folders.push(trash[idx]);
      });
      trash = trash.filter((_, idx) => !selected.includes(idx));
      saveData();
      renderFolders();
      renderTrash();
    });

  function showContextMenu(x, y, index) {
    let menu = document.getElementById("context-menu");
    if (!menu) {
      menu = document.createElement("div");
      menu.id = "context-menu";
      menu.className = "context-menu";
      document.body.appendChild(menu);
    }
    menu.innerHTML = `
      <button onclick="deleteFolder(${index})">🗑️ 삭제</button>
      <button onclick="openRenameModal(${index})">✏️ 이름 변경</button>
      <button >내려받기</button>
    `;
    menu.style.top = y + "px";
    menu.style.left = x + "px";
    menu.style.display = "block";
    document.addEventListener(
      "click",
      () => {
        menu.style.display = "none";
      },
      { once: true }
    );
  }

  window.openRenameModal = function (index) {
    renameIndex = index;
    const folder = folders[index];
    document.getElementById("renameInput").value = folder.name;
    document.getElementById("renameModal").style.display = "flex";
    document.getElementById("renameInput").focus();
  };

  window.closeRenameModal = function () {
    document.getElementById("renameModal").style.display = "none";
    renameIndex = null;
  };

  window.confirmRename = function () {
    const newName = document.getElementById("renameInput").value.trim();
    if (!newName) return alert("이름을 입력해주세요.");
    const duplicate = folders.some(
      (f, i) =>
        i !== renameIndex && f.name.toLowerCase() === newName.toLowerCase()
    );
    if (duplicate) return alert("이미 존재하는 폴더명입니다.");
    folders[renameIndex].name = newName;
    folders[renameIndex].modifiedAt = new Date().toLocaleString();
    saveData();
    closeRenameModal();
    renderFolders();
  };

  function updateSortIcons() {
    document.querySelectorAll("th[data-key]").forEach((th) => {
      const key = th.dataset.key;
      if (key === sortKey) {
        th.innerHTML = `${th.dataset.label} ${sortAsc ? "⬆️" : "⬇️"}`;
      } else {
        th.innerHTML = th.dataset.label;
      }
    });
  }

  document.querySelectorAll("th[data-key]").forEach((th) => {
    th.addEventListener("click", () => {
      const key = th.dataset.key;
      if (sortKey === key) {
        sortAsc = !sortAsc;
      } else {
        sortKey = key;
        sortAsc = true;
      }
      updateSortIcons();
      renderFolders();
    });
  });

  window.deleteFolder = function (index) {
    if (folders[index]) {
      trash.push(folders[index]);
      folders.splice(index, 1);
      saveData();
      renderFolders();
      renderTrash();
    }
  };

  window.restoreFromTrash = function (index) {
    folders.push(trash[index]);
    trash.splice(index, 1);
    saveData();
    renderFolders();
    renderTrash();
  };

  function saveData() {
    localStorage.setItem("folders", JSON.stringify(folders));
    localStorage.setItem("trash", JSON.stringify(trash));
  }

  renderFolders();
  renderTrash();
});
