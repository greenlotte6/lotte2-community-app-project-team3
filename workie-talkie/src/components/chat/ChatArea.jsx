// components/ChatArea.jsx
import React from "react";
import { Hash, MessageCircle, Users } from "lucide-react";
import { useChat } from "../../context/ChatContext";

// 채팅 헤더 컴포넌트
const ChatHeader = ({ currentChat, activeChat }) => {
  return (
    <div className="chat-header">
      <div className="header-content">
        {activeChat.type === "channel" ? (
          <>
            <Hash className="channel-icon" />
            <span className="chat-name">{currentChat.name}</span>
            <Users className="members-icon" />
            <span className="member-count">
              {currentChat.members?.length}명
            </span>
          </>
        ) : (
          <>
            <MessageCircle className="channel-icon" />
            <span className="chat-name">{currentChat.name}</span>
            <div
              className={`online-status ${
                currentChat.isOnline ? "online" : "offline"
              }`}
            ></div>
            <span className="status-text">
              {currentChat.isOnline ? "온라인" : "오프라인"}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

// 메시지 입력창 컴포넌트
const MessageInput = ({ currentChat, activeChat }) => {
  return (
    <div className="message-input">
      <input
        type="text"
        placeholder={`${
          activeChat.type === "channel"
            ? "#" + currentChat.name
            : currentChat.name
        }에 메시지 보내기`}
      />
    </div>
  );
};

// 메인 채팅 영역 컴포넌트
const ChatArea = () => {
  const { getCurrentChat, activeChat } = useChat();
  const currentChat = getCurrentChat();

  return (
    <div className="chat-area">
      {/* 채팅 헤더 */}
      {currentChat && (
        <ChatHeader currentChat={currentChat} activeChat={activeChat} />
      )}

      {/* 채팅 메시지 영역 */}
      <div className="messages-area">
        {currentChat ? (
          <div className="empty-state">
            {activeChat.type === "channel"
              ? `#${currentChat.name}`
              : currentChat.name}{" "}
            채팅을 시작하세요
          </div>
        ) : (
          <div className="empty-state">채널이나 DM을 선택해주세요</div>
        )}
      </div>

      {/* 메시지 입력 영역 */}
      {currentChat && (
        <MessageInput currentChat={currentChat} activeChat={activeChat} />
      )}
    </div>
  );
};

export default ChatArea;
