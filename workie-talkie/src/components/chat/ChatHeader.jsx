// src/components/chat/ChatHeader.jsx
import React from "react";

export const ChatHeader = ({ onAddContact, onNewChat }) => {
  return (
    <header className="chat-header">
      {/* 기존 헤더 내용 */}
      <div className="header-left">
        <h1>채팅</h1>
      </div>

      {/* 새로 추가된 액션 버튼들 */}
      <div className="header-actions">
        <button
          className="header-action-btn"
          onClick={onNewChat}
          title="새 채팅"
        >
          💬
        </button>
        <button
          className="header-action-btn"
          onClick={onAddContact}
          title="친구 추가"
        >
          👥
        </button>

        {/* 기존 버튼들 (설정, 검색 등) */}
        <button className="header-action-btn">⚙️</button>
      </div>
    </header>
  );
};
