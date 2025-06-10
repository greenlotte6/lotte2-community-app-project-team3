import React, { useState, useRef, useEffect } from "react";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

            {/* 드롭다운 영역 */}
            <div className="dropdown-wrapper" ref={dropdownRef}>
              <button
                className="create-folder-btn"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              >
                + 새로 만들기
              </button>
              {isDropdownOpen && (
                <ul className="dropdown-menu">
                  <li
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenFolderModal();
                    }}
                  >
                    📁 새 폴더 만들기
                  </li>
                  <li
                    onClick={() => {
                      setIsDropdownOpen(false);
                      alert("📂 폴더 업로드 기능은 추후 구현됩니다.");
                    }}
                  >
                    📂 폴더 업로드
                  </li>
                  <li
                    onClick={() => {
                      setIsDropdownOpen(false);
                      document.getElementById("fileElem").click();
                    }}
                  >
                    📄 파일 업로드
                  </li>
                </ul>
              )}
              <input
                type="file"
                id="fileElem"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) alert(`📄 업로드할 파일: ${file.name}`);
                }}
              />
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
