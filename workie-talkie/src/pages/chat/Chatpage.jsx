import React from "react";

import { ChatLayout } from "../../layouts/ChatLayout";
import { Aside } from "../../components/chat/Aside";
import { ChatHeader } from "../../components/chat/ChatHeader";
import { ChatMessages } from "../../components/chat/ChatMessages";
import { ChatInput } from "../../components/chat/ChatInput";

const ChatPage = () => {
  return (
    <ChatLayout>
      <main>
        <ChatHeader />
        <ChatMessages />
        <ChatInput />
      </main>
    </ChatLayout>
  );
};

export default ChatPage;
