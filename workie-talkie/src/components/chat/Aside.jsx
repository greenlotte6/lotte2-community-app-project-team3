import React from "react";

export const Aside = () => {
  return (
    <>
      <div className="sidebar-header">
        <div className="sidebar-title">채팅</div>
        <div className="sidebar-actions">
          <button className="icon-btn">⚙️</button>
          <button className="icon-btn">✏️</button>
        </div>
      </div>
      <div className="search-container">
        <input className="search-box" placeholder="채팅방 검색..." />
      </div>
      <div className="chat-list">
        {["김민수", "이영희", "박철수"].map((name, i) => (
          <div className={`chat-item ${i === 0 ? "active" : ""}`} key={name}>
            <div className="profile-pic">{name[0]}</div>
            <div className="chat-info">
              <div className="chat-name">{name}</div>
              <div className="chat-preview">메시지 미리보기...</div>
            </div>
            <div className="chat-time">오전 9:00</div>
          </div>
        ))}
      </div>
    </>
  );
};
