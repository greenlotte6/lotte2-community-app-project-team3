// components/Sidebar.jsx
import React from "react";
import { Plus, Crown, Settings, Hash, LogOut } from "lucide-react";
import { useChat } from "../../context/ChatContext";

// 사용자 프로필 컴포넌트
const UserProfile = () => {
  const { currentUser } = useChat();

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-info">
          <div className="avatar">{currentUser.name[0]}</div>
          <span className="username">{currentUser.name}</span>
          {currentUser.isPremium && <Crown className="premium-crown" />}
        </div>
        <Settings className="settings-icon" />
      </div>
      <div className="user-status">
        {currentUser.isPremium ? "프리미엄 회원" : "무료 회원"}
      </div>
    </div>
  );
};

// 채널 아이템 컴포넌트
const ChannelItem = ({ channel }) => {
  const { currentUser, activeChat, setActiveChat, setShowLeaveModal } =
    useChat();

  const isActive =
    activeChat.type === "channel" && activeChat.id === channel.id;
  const isOwner = channel.ownerId === currentUser.id;

  return (
    <div
      className={`channel-item ${isActive ? "active" : ""}`}
      onClick={() => setActiveChat({ type: "channel", id: channel.id })}
    >
      <div className="channel-info">
        <Hash className="hash-icon" />
        <span className="channel-name">{channel.name}</span>
      </div>
      {isOwner && (
        <LogOut
          className="leave-icon"
          onClick={(e) => {
            e.stopPropagation();
            setShowLeaveModal(channel.id);
          }}
        />
      )}
    </div>
  );
};

// DM 아이템 컴포넌트
const DMItem = ({ dm }) => {
  const { activeChat, setActiveChat } = useChat();
  const isActive = activeChat.type === "dm" && activeChat.id === dm.id;

  return (
    <div
      className={`dm-item ${isActive ? "active" : ""}`}
      onClick={() => setActiveChat({ type: "dm", id: dm.id })}
    >
      <div className="dm-avatar">
        <div className="avatar">{dm.name[0]}</div>
        {dm.isOnline && <div className="online-indicator"></div>}
      </div>
      <span className="dm-name">{dm.name}</span>
    </div>
  );
};

// 메인 사이드바 컴포넌트
const Sidebar = () => {
  const { currentUser, channels, dmList, setShowChannelModal, setShowDmModal } =
    useChat();

  return (
    <div className="sidebar">
      {/* 사용자 정보 */}
      <UserProfile />

      {/* 채널 섹션 */}
      <div className="chat-sections">
        <div className="section">
          <div className="section-header">
            <span className="section-title">채널</span>
            <Plus
              className="add-icon"
              onClick={() => setShowChannelModal(true)}
            />
          </div>
          <div className="items-list">
            {channels.map((channel) => (
              <ChannelItem key={channel.id} channel={channel} />
            ))}
          </div>
        </div>

        {/* DM 섹션 */}
        <div className="section">
          <div className="section-header">
            <span className="section-title">다이렉트 메시지</span>
            <Plus className="add-icon" onClick={() => setShowDmModal(true)} />
          </div>
          <div className="items-list">
            {dmList.map((dm) => (
              <DMItem key={dm.id} dm={dm} />
            ))}
          </div>
        </div>
      </div>

      {/* 회원 등급 업그레이드 안내 */}
      {!currentUser.isPremium && (
        <div className="premium-upgrade">
          <div className="upgrade-title">
            <Crown className="crown-icon" />
            프리미엄으로 업그레이드하세요!
          </div>
          <ul className="upgrade-features">
            <li>• 무제한 채널 멤버</li>
            <li>• 무제한 DM</li>
            <li>• 더 많은 기능</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
