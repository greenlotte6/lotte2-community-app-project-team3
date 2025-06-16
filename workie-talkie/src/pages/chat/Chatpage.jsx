// pages/ChatPage.jsx
import React from "react";
import { ChatProvider } from "../../context/ChatContext";
import { ToastProvider } from "../../components/chat/ToastNotification";
import { ChatLayout } from "../../layouts/ChatLayout";
import Sidebar from "../../components/chat/Sidebar";
import ChatArea from "../../components/chat/ChatArea";
import Modals from "../../components/chat/Modals";
import "../../styles/chat/chat.scss";

const ChatPage = () => {
  return (
    <ToastProvider>
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
    </ToastProvider>
  );
};

export default ChatPage;
