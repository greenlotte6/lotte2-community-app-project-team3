import React from "react";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { Aside } from "../components/chat/Aside";

export const ChatLayout = ({ children }) => {
  return (
    <div className="container">
      <Header />
      <div id="chat-container">
        <div id="wrapper">{children}</div>
      </div>
      <Footer />
    </div>
  );
};
