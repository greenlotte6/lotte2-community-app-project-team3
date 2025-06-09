import React from "react";

export const Aside = () => {
  return (
    <>
      <aside>
        <div className="sidebar-header">
          <div className="sidebar-title">채팅</div>
          <div className="sidebar-actions">
            <button className="icon-btn">⚙️</button>
            <button className="icon-btn">✏️</button>
          </div>
        </div>

        <div className="search-container">
          <input
            type="text"
            className="search-box"
            placeholder="채팅방 검색..."
          />
        </div>

        <div className="chat-list">
          <div className="chat-item active">
            <div className="profile-pic">김</div>
            <div className="chat-info">
              <div className="chat-name">김민수</div>
              <div className="chat-preview">
                안녕하세요! 오늘 회의 시간이...
              </div>
            </div>
            <div className="chat-time">오후 2:30</div>
          </div>

          <div className="chat-item">
            <div className="profile-pic">이</div>
            <div className="chat-info">
              <div className="chat-name">이영희</div>
              <div className="chat-preview">네, 알겠습니다.</div>
            </div>
            <div className="chat-time">오후 1:15</div>
          </div>

          <div className="chat-item">
            <div className="profile-pic">박</div>
            <div className="chat-info">
              <div className="chat-name">박철수</div>
              <div className="chat-preview">프로젝트 진행 상황이 어떻게...</div>
            </div>
            <div className="chat-time">오전 11:20</div>
          </div>

          <div className="chat-item">
            <div className="profile-pic">최</div>
            <div className="chat-info">
              <div className="chat-name">최수진</div>
              <div className="chat-preview">내일 저녁에 시간 되시나요?</div>
            </div>
            <div className="chat-time">오전 9:45</div>
          </div>

          <div className="chat-item">
            <div className="profile-pic">정</div>
            <div className="chat-info">
              <div className="chat-name">정한솔</div>
              <div className="chat-preview">좋은 아이디어네요!</div>
            </div>
            <div className="chat-time">어제</div>
          </div>
        </div>
      </aside>
    </>
  );
};
