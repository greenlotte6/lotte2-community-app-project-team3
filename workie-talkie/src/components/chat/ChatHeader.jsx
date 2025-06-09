import React from "react";
import { DropdownMenu } from "./DropdownMenu ";

export const ChatHeader = () => {
  return (
    <div className="chat-header">
      <div className="chat-user-info">
        <div className="chat-user-pic">김</div>
        <div className="chat-user-details">
          <h3>김민수</h3>
          <div className="chat-user-status">온라인</div>
        </div>
      </div>
      <div className="chat-actions">
        <DropdownMenu />
      </div>
    </div>
  );
};
