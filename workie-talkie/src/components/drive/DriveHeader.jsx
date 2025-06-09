import React from "react";

export const DriveHeader = ({
  activeTab,
  selectedIndexes = [],
  onOpenFolderModal,
  onDelete,
  onRestore,
  onRename,
}) => {
  const isTrash = activeTab === "🗑️ 휴지통";
  const isDisabled = selectedIndexes.length === 0;

  return (
    <header className="header">
      <h2 id="main-title">
        {activeTab}
        {!isTrash && (
          <span
            id="current-path"
            style={{ fontSize: "14px", color: "#555", marginLeft: "10px" }}
          >
            /
          </span>
        )}
        {!isTrash && (
          <button
            id="back-btn"
            style={{ marginLeft: "10px", fontSize: "12px", padding: "2px 6px" }}
            onClick={() => alert("뒤로가기 기능은 추후 구현")}
          >
            🔙 뒤로가기
          </button>
        )}
      </h2>

      <div>
        {!isTrash && (
          <>
            <button className="download-btn" disabled={isDisabled}>
              ⬇️ 내려받기
            </button>
            <button
              className="rename-btn"
              disabled={selectedIndexes.length !== 1}
              onClick={() => onRename(selectedIndexes[0])}
            >
              ✏️ 이름 변경
            </button>
            <button className="move-btn" disabled={isDisabled}>
              📂 이동
            </button>

            <div className="dropdown-wrapper">
              <button className="create-folder-btn" onClick={onOpenFolderModal}>
                + 새로 만들기
              </button>
            </div>
          </>
        )}

        {isTrash && (
          <button
            className="restore-selected-btn"
            disabled={isDisabled}
            onClick={() => onRestore(selectedIndexes)}
          >
            복원
          </button>
        )}

        <button
          className="delete-selected-btn"
          disabled={isDisabled}
          onClick={() => onDelete(selectedIndexes)}
        >
          🗑️ 삭제
        </button>
      </div>
    </header>
  );
};
