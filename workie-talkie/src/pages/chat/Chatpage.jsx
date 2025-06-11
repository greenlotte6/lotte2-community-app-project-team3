// pages/ChatPage.jsx
import React from "react";
import { ChatProvider } from "../../context/ChatContext";
import { ChatLayout } from "../../layouts/ChatLayout"; // ChatLayout import 수정
import Sidebar from "../../components/chat/Sidebar";
import ChatArea from "../../components/chat/ChatArea";
import Modals from "../../components/chat/Modals";
import "../../styles/chat/chat.scss"; // SCSS 파일 import 경로 수정

const ChatPage = () => {
  return (
    <ChatProvider>
      <ChatLayout>
        <div id="chat-page">
          <div id="chat-container">
            <Sidebar />
            <ChatArea />
            <Modals />
          </div>
        </div>
      </ChatLayout>
    </ChatProvider>
  );
};

export default ChatPage;
