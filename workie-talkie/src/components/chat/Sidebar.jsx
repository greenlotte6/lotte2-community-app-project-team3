import React, { useEffect } from "react";
import {
  Plus,
  Crown,
  Settings,
  Hash,
  LogOut,
  MessageCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useChat } from "../../context/ChatContext";

// 사용자 프로필 컴포넌트
const UserProfile = () => {
  const { currentUser } = useChat();

  if (!currentUser) return null;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-info">
          <div className="avatar">
            {currentUser.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="user-details">
            <span className="username">{currentUser.name}</span>
            {currentUser.isPremium && <Crown className="premium-crown" />}
          </div>
        </div>
        <Settings className="settings-icon" />
      </div>
      <div className="user-status">
        <div className="status-indicator online"></div>
        {currentUser.isPremium ? "프리미엄 회원" : "무료 회원"}
      </div>
    </div>
  );
};

// 채널 아이템 컴포넌트
const ChannelItem = ({ channel }) => {
  const { currentUser, activeChat, setActiveChat, showLeaveChannelModal } =
    useChat();

  const isActive =
    activeChat.type === "channel" && activeChat.id === channel.id;
  const isOwner = channel.ownerId === currentUser?.id;
  const hasUnread = channel.unreadCount > 0;

  const handleChannelClick = () => {
    setActiveChat("channel", channel.id);
  };

  const handleLeaveClick = (e) => {
    e.stopPropagation();
    showLeaveChannelModal(channel.id);
  };

  return (
    <div
      className={`channel-item ${isActive ? "active" : ""} ${
        hasUnread ? "unread" : ""
      }`}
      onClick={handleChannelClick}
    >
      <div className="channel-info">
        <Hash className="hash-icon" />
        <span className="channel-name">{channel.name}</span>
        {hasUnread && (
          <span className="unread-badge">{channel.unreadCount}</span>
        )}
      </div>

      <div className="channel-actions">
        {channel.memberCount && (
          <span className="member-count">{channel.memberCount}</span>
        )}
        <LogOut
          className="leave-icon"
          onClick={handleLeaveClick}
          title={isOwner ? "채널 삭제" : "채널 나가기"}
          style={{
            width: "14px",
            height: "14px",
            color: "#f87171",
            cursor: "pointer",
            marginLeft: "8px",
            opacity: 1, // 🔥 강제 표시
            visibility: "visible", // 🔥 강제 표시
            display: "inline-block",
          }}
        />
      </div>
    </div>
  );
};

// DM 아이템 컴포넌트
const DMItem = ({ dm }) => {
  const { activeChat, setActiveChat } = useChat();

  const isActive = activeChat.type === "dm" && activeChat.id === dm.id;
  const hasUnread = dm.unreadCount > 0;

  const handleDMClick = () => {
    setActiveChat("dm", dm.id);
  };

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return "방금";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}분`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간`;
    return `${Math.floor(diff / 86400000)}일`;
  };

  return (
    <div
      className={`dm-item ${isActive ? "active" : ""} ${
        hasUnread ? "unread" : ""
      }`}
      onClick={handleDMClick}
    >
      <div className="dm-avatar-container">
        <div className="dm-avatar">
          {dm.otherUserName?.[0]?.toUpperCase() ||
            dm.name?.[0]?.toUpperCase() ||
            "?"}
        </div>
        {dm.isOnline && <div className="online-indicator"></div>}
      </div>

      <div className="dm-content">
        <div className="dm-header">
          <span className="dm-name">{dm.otherUserName || dm.name}</span>
          {dm.lastMessageTime && (
            <span className="last-message-time">
              {formatLastMessageTime(dm.lastMessageTime)}
            </span>
          )}
        </div>

        {dm.lastMessage && (
          <div className="last-message">
            {dm.lastMessage.length > 30
              ? dm.lastMessage.substring(0, 30) + "..."
              : dm.lastMessage}
          </div>
        )}
      </div>

      {hasUnread && <div className="unread-badge">{dm.unreadCount}</div>}
    </div>
  );
};

// 로딩 스켈레톤 컴포넌트
const LoadingSkeleton = ({ count = 3 }) => {
  return (
    <div className="loading-skeleton">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-item">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-content">
            <div className="skeleton-line skeleton-line-title"></div>
            <div className="skeleton-line skeleton-line-subtitle"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// 에러 메시지 컴포넌트
const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-message">
      <AlertCircle className="error-icon" />
      <span className="error-text">{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          다시 시도
        </button>
      )}
    </div>
  );
};

// 빈 상태 컴포넌트
const EmptyState = ({ type, onAdd }) => {
  const messages = {
    channels: {
      title: "채널이 없습니다",
      description: "새 채널을 만들어 팀원들과 소통해보세요",
      buttonText: "첫 채널 만들기",
    },
    dms: {
      title: "DM이 없습니다",
      description: "동료와 개인 대화를 시작해보세요",
      buttonText: "DM 시작하기",
    },
  };

  const config = messages[type];

  return (
    <div className="empty-state">
      <div className="empty-content">
        <p className="empty-title">{config.title}</p>
        <p className="empty-description">{config.description}</p>
        <button onClick={onAdd} className="empty-action-btn">
          <Plus className="plus-icon" />
          {config.buttonText}
        </button>
      </div>
    </div>
  );
};

// 메인 사이드바 컴포넌트
const Sidebar = () => {
  const {
    currentUser,
    channels,
    dmList,
    channelsLoading,
    dmsLoading,
    error,
    setShowChannelModal,
    setShowDmModal,
    refreshChannels,
    refreshDMs,
  } = useChat();

  // 정기적으로 온라인 상태 업데이트
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(() => {
      refreshDMs(); // DM 목록과 온라인 상태 새로고침
    }, 30000); // 30초마다

    return () => clearInterval(interval);
  }, [currentUser, refreshDMs]);

  const handleAddChannel = () => {
    setShowChannelModal(true);
  };

  const handleAddDM = () => {
    setShowDmModal(true);
  };

  if (!currentUser) {
    return (
      <div className="sidebar">
        <div className="loading-user">
          <Loader2 className="loading-icon animate-spin" />
          <span>사용자 정보 로딩 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar">
      {/* 사용자 정보 */}
      <UserProfile />

      {/* 채팅 섹션들 */}
      <div className="chat-sections">
        {/* 채널 섹션 */}
        <div className="section">
          <div className="section-header">
            <span className="section-title">
              채널{" "}
              {!channelsLoading &&
                channels.length > 0 &&
                `(${channels.length})`}
            </span>
            <button
              className="add-button"
              onClick={handleAddChannel}
              title="새 채널 만들기"
            >
              <Plus className="add-icon" />
            </button>
          </div>

          <div className="items-list">
            {channelsLoading ? (
              <LoadingSkeleton count={2} />
            ) : error && channels.length === 0 ? (
              <ErrorMessage
                message="채널을 불러올 수 없습니다"
                onRetry={refreshChannels}
              />
            ) : channels.length === 0 ? (
              <EmptyState type="channels" onAdd={handleAddChannel} />
            ) : (
              channels.map((channel) => (
                <ChannelItem key={channel.id} channel={channel} />
              ))
            )}
          </div>
        </div>

        {/* DM 섹션 */}
        <div className="section">
          <div className="section-header">
            <span className="section-title">
              다이렉트 메시지{" "}
              {!dmsLoading && dmList.length > 0 && `(${dmList.length})`}
            </span>
            <button
              className="add-button"
              onClick={handleAddDM}
              title="새 DM 시작하기"
            >
              <Plus className="add-icon" />
            </button>
          </div>

          <div className="items-list">
            {dmsLoading ? (
              <LoadingSkeleton count={3} />
            ) : error && dmList.length === 0 ? (
              <ErrorMessage
                message="DM을 불러올 수 없습니다"
                onRetry={refreshDMs}
              />
            ) : dmList.length === 0 ? (
              <EmptyState type="dms" onAdd={handleAddDM} />
            ) : (
              dmList.map((dm) => <DMItem key={dm.id} dm={dm} />)
            )}
          </div>
        </div>
      </div>

      {/* 회원 등급 업그레이드 안내 */}
      {!currentUser.isPremium && (
        <div className="premium-upgrade">
          <div className="upgrade-header">
            <Crown className="crown-icon" />
            <span className="upgrade-title">프리미엄으로 업그레이드!</span>
          </div>
          <ul className="upgrade-features">
            <li>• 무제한 채널 멤버</li>
            <li>• 무제한 DM</li>
            <li>• 파일 업로드</li>
            <li>• 고급 검색</li>
          </ul>
          <button className="upgrade-button">업그레이드하기</button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
