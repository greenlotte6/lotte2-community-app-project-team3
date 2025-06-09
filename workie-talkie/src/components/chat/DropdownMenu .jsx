import React from "react";

export const DropdownMenu = () => {
  return (
    <div className="dropdown-menu" id="dropdownMenu">
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
  );
};
