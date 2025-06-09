import React from "react";

export const ChatInput = () => {
  return (
    <div className="chat-input">
      <div className="input-container">
        <button className="icon-btn">📎</button>
        <input
          type="text"
          className="message-input"
          placeholder="메시지를 입력하세요..."
        />
        <button className="icon-btn">😊</button>
        <button className="send-btn">→</button>
      </div>
    </div>
  );
};
