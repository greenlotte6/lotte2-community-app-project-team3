import React, { useState } from "react";

export const FolderModal = ({ onClose, onCreate }) => {
  const [folderName, setFolderName] = useState("");

  const handleSubmit = () => {
    if (!folderName.trim()) {
      alert("폴더명을 입력해주세요.");
      return;
    }
    onCreate(folderName.trim());
    setFolderName("");
  };

  return (
    <div className="modal-overlay" style={{ display: "flex" }}>
      <div className="modal">
        <div className="modal-header">
          <span>새 폴더 추가</span>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <input
            type="text"
            placeholder="폴더명을 입력해주세요."
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            취소
          </button>
          <button className="confirm-btn" onClick={handleSubmit}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
