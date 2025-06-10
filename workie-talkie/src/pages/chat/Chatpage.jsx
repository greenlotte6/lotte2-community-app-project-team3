// src/pages/chat/Chatpage.jsx
import React, { useState } from "react";

// 레이아웃
import { ChatLayout } from "../../layouts/ChatLayout";

// 채팅 컴포넌트들
import { Aside } from "../../components/chat/Aside";
import { ChatHeader } from "../../components/chat/ChatHeader";
import { ChatMessages } from "../../components/chat/ChatMessages";
import { ChatInput } from "../../components/chat/ChatInput";

const ChatPage = () => {
  // 기본 상태들
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);

  // 현재 사용자 정보 (확장을 위해 plan 필드 유지하되 사용하지 않음)
  const [currentUser] = useState({
    id: 1,
    name: "김철수",
    userCode: "USER123",
    plan: "FREE", // 확장을 위해 유지 (현재는 사용하지 않음)
    organization: { orgName: "우리 회사" },
  });

  // 핸들러들
  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setSelectedContact(null);
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
  };

  return (
    <ChatLayout>
      {/* 모든 필요한 props 전달 */}
      <Aside
        onRoomSelect={handleRoomSelect}
        onContactSelect={handleContactSelect}
        currentUser={currentUser}
        selectedRoomId={selectedRoom?.id}
      />

      <main>
        <ChatHeader
          selectedRoom={selectedRoom}
          selectedContact={selectedContact}
        />
        <ChatMessages selectedRoom={selectedRoom} />
        <ChatInput selectedRoom={selectedRoom} />
      </main>
    </ChatLayout>
  );
};

export default ChatPage;
