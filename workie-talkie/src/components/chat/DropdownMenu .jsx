import React, { useState } from "react";

export const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="dropdown-container">
      <button className="icon-btn" onClick={toggleDropdown}>
        ⋯
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-item">
            <span>👤</span>
            <span>프로필 보기</span>
          </div>
          <div className="dropdown-item">
            <span>🔕</span>
            <span>알림 끄기</span>
          </div>
          <div className="dropdown-item">
            <span>📌</span>
            <span>채팅 고정</span>
          </div>
          <div className="dropdown-item">
            <span>🔍</span>
            <span>채팅에서 검색</span>
          </div>
          <div className="dropdown-item">
            <span>📂</span>
            <span>파일 보기</span>
          </div>
          <div className="dropdown-item danger">
            <span>🚫</span>
            <span>차단하기</span>
          </div>
          <div className="dropdown-item danger">
            <span>🗑️</span>
            <span>채팅 삭제</span>
          </div>
        </div>
      )}
    </div>
  );
};
