import React from "react";

export const ChatMessages = () => {
  return (
    <div className="chat-messages">
      <div className="message received">
        <div className="message-avatar">김</div>
        <div className="message-bubble">
          안녕하세요! 오늘 회의 시간이 몇 시인지 확인해주실 수 있나요?
        </div>
      </div>
      <div className="message sent">
        <div className="message-bubble">
          네, 오후 3시에 회의실 A에서 진행됩니다.
        </div>
      </div>
      <div className="message received">
        <div className="message-avatar">김</div>
        <div className="message-bubble">
          감사합니다! 미리 준비해서 참석하겠습니다.
        </div>
      </div>
      <div className="message sent">
        <div className="message-bubble">
          네, 좋습니다. 필요한 자료가 있으시면 미리 말씀해주세요.
        </div>
      </div>
      <div className="message received">
        <div className="message-avatar">김</div>
        <div className="message-bubble">
          혹시 프레젠테이션 자료도 준비해야 할까요?
        </div>
      </div>
    </div>
  );
};
