import React, { useState, useEffect } from "react";

export const RenameModal = ({ onClose, onConfirm, folderName }) => {
  const [newName, setNewName] = useState("");

  useEffect(() => {
    setNewName(folderName);
  }, [folderName]);

  const handleSubmit = () => {
    if (!newName.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    onConfirm(newName.trim());
  };

  return (
    <div className="modal-overlay" style={{ display: "flex" }}>
      <div className="modal">
        <div className="modal-header">
          <span>이름 변경</span>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <input
            type="text"
            placeholder="새 이름을 입력해주세요."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
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
