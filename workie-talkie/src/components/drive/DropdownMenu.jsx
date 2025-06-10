import React, { useState, useRef } from "react";

export const DropdownMenu = ({ onOpenFolderModal, onUploadFolder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="dropdown-wrapper">
      <button className="create-folder-btn" onClick={toggleDropdown}>
        + 새로 만들기
      </button>

      {isOpen && (
        <ul className="dropdown-menu">
          <li onClick={onOpenFolderModal}>📁 새 폴더 만들기</li>
          <li onClick={onUploadFolder}>📂 폴더 업로드</li>
          <li onClick={handleFileClick}>📄 파일 업로드</li>
        </ul>
      )}

      <input
        type="file"
        multiple
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          // 파일 선택 처리
          console.log("선택된 파일:", e.target.files);
        }}
      />
    </div>
  );
};
