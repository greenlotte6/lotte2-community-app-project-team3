// src/components/chat/Aside.jsx
import React, { useState, useEffect } from "react";
// 모달들 import
import { AddContactModal } from "./AddContactModal";
import { CreateChannelModal } from "./CreateChannelModal";
import { CreateDMModal } from "./CreateDMModal";
import { ChannelSettingsModal } from "./ChannelSettingsModal";

export const Aside = ({
  onRoomSelect,
  onContactSelect,
  currentUser,
  selectedRoomId,
}) => {
  const [activeTab, setActiveTab] = useState("chats"); // 'chats' or 'contacts'
  const [chatSubTab, setChatSubTab] = useState("all"); // 'all', 'channels', 'dms'

  // 채팅 데이터
  const [channels, setChannels] = useState([]);
  const [dms, setDMs] = useState([]);

  // 연락처 데이터
  const [contacts, setContacts] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  // 모달 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddContact, setShowAddContact] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showCreateDM, setShowCreateDM] = useState(false);
  const [showChannelSettings, setShowChannelSettings] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(false);

  // 탭별 초기 데이터 로드
  useEffect(() => {
    if (activeTab === "chats") {
      loadChannels();
      loadDMs();
    } else if (activeTab === "contacts") {
      loadContacts();
      loadFriendRequests();
    }
  }, [activeTab]);

  // 채널 목록 로드
  const loadChannels = async () => {
    try {
      const response = await fetch("/api/chat/channels", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) {
        const channelData = await response.json();
        setChannels(channelData);
      }
    } catch (error) {
      console.error("채널 목록 로드 실패:", error);
    }
  };

  // DM 목록 로드
  const loadDMs = async () => {
    try {
      const response = await fetch("/api/chat/dms", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) {
        const dmData = await response.json();
        setDMs(dmData);
      }
    } catch (error) {
      console.error("DM 목록 로드 실패:", error);
    }
  };

  // 연락처 목록 로드
  const loadContacts = async () => {
    try {
      const response = await fetch("/api/contacts", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) {
        const contactData = await response.json();
        setContacts(contactData.contacts || []);
      }
    } catch (error) {
      console.error("연락처 목록 로드 실패:", error);
    }
  };

  // 친구 요청 목록 로드
  const loadFriendRequests = async () => {
    try {
      const response = await fetch("/api/friends/requests", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) {
        const requests = await response.json();
        setFriendRequests(requests || []);
      }
    } catch (error) {
      console.error("친구 요청 로드 실패:", error);
    }
  };

  // 채널 생성 완료 핸들러
  const handleChannelCreated = (channel) => {
    loadChannels(); // 목록 새로고침
    onRoomSelect(channel); // 새 채널 선택
    setShowCreateChannel(false);
  };

  // DM 생성 완료 핸들러
  const handleDMCreated = (dm) => {
    loadDMs(); // 목록 새로고침
    onRoomSelect(dm); // 새 DM 선택
    setShowCreateDM(false);
  };

  // 채널 설정 열기
  const openChannelSettings = (channel, e) => {
    e.stopPropagation();
    setSelectedChannel(channel);
    setShowChannelSettings(true);
  };

  // 채널 업데이트 후 새로고침
  const handleChannelUpdated = () => {
    loadChannels();
    setShowChannelSettings(false);
    setSelectedChannel(null);
  };

  // 필터링된 데이터
  const getFilteredChats = () => {
    let allChats = [];

    if (chatSubTab === "all" || chatSubTab === "channels") {
      allChats = [
        ...allChats,
        ...channels.map((ch) => ({ ...ch, type: "channel" })),
      ];
    }

    if (chatSubTab === "all" || chatSubTab === "dms") {
      allChats = [...allChats, ...dms.map((dm) => ({ ...dm, type: "dm" }))];
    }

    return allChats.filter((chat) =>
      (chat.channelName || chat.otherUser?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.contactUser?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // 시간 포맷팅
  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return "";
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now - messageTime) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageTime.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return messageTime.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <>
      <aside>
        {/* 탭 헤더 */}
        <div className="sidebar-header">
          <div className="tab-container">
            <button
              className={`tab-btn ${activeTab === "chats" ? "active" : ""}`}
              onClick={() => setActiveTab("chats")}
            >
              💬 채팅
              {(channels.some((ch) => ch.unreadCount > 0) ||
                dms.some((dm) => dm.unreadCount > 0)) && (
                <span className="tab-badge"></span>
              )}
            </button>
            <button
              className={`tab-btn ${activeTab === "contacts" ? "active" : ""}`}
              onClick={() => setActiveTab("contacts")}
            >
              👥 연락처
              {friendRequests.length > 0 && (
                <span className="tab-badge">{friendRequests.length}</span>
              )}
            </button>
          </div>

          <div className="sidebar-actions">
            <button className="icon-btn" title="설정">
              ⚙️
            </button>

            {/* 채팅 탭: 드롭다운 메뉴 */}
            {activeTab === "chats" && (
              <div className="action-dropdown">
                <button
                  className="icon-btn"
                  onClick={() => setShowActionMenu(!showActionMenu)}
                >
                  ➕
                </button>
                {showActionMenu && (
                  <div className="dropdown-menu">
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setShowCreateChannel(true);
                        setShowActionMenu(false);
                      }}
                    >
                      🏢 새 채널
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setShowCreateDM(true);
                        setShowActionMenu(false);
                      }}
                    >
                      💬 새 DM
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 연락처 탭: 친구 추가 */}
            {activeTab === "contacts" && (
              <button
                className="icon-btn"
                title="친구 추가"
                onClick={() => setShowAddContact(true)}
              >
                ➕
              </button>
            )}
          </div>
        </div>

        {/* 채팅 서브탭 */}
        {activeTab === "chats" && (
          <div className="chat-subtabs">
            <button
              className={`subtab ${chatSubTab === "all" ? "active" : ""}`}
              onClick={() => setChatSubTab("all")}
            >
              전체 ({channels.length + dms.length})
            </button>
            <button
              className={`subtab ${chatSubTab === "channels" ? "active" : ""}`}
              onClick={() => setChatSubTab("channels")}
            >
              채널 ({channels.length})
            </button>
            <button
              className={`subtab ${chatSubTab === "dms" ? "active" : ""}`}
              onClick={() => setChatSubTab("dms")}
            >
              DM ({dms.length})
            </button>
          </div>
        )}

        {/* 검색 */}
        <div className="search-container">
          <input
            type="text"
            className="search-box"
            placeholder={
              activeTab === "chats" ? "채팅 검색..." : "연락처 검색..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 친구 요청 알림 (연락처 탭에서만) */}
        {activeTab === "contacts" && friendRequests.length > 0 && (
          <div className="friend-requests-section">
            <div className="section-title">
              👋 친구 요청 ({friendRequests.length})
            </div>
            {friendRequests.map((request) => (
              <div key={request.id} className="friend-request-item">
                <div className="request-info">
                  <div className="request-avatar">
                    {request.sender.name.charAt(0)}
                  </div>
                  <div className="request-details">
                    <div className="request-name">{request.sender.name}</div>
                    <div className="request-message">
                      {request.message || "친구 요청을 보냈습니다."}
                    </div>
                  </div>
                </div>
                <div className="request-actions">
                  <button className="accept-btn">✓</button>
                  <button className="reject-btn">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 목록 영역 */}
        <div className="list-container">
          {activeTab === "chats" ? (
            // 채팅 목록 (채널 + DM)
            <div className="chat-list">
              {getFilteredChats().length === 0 ? (
                <div className="empty-state">
                  <div>💬</div>
                  <div>아직 채팅이 없습니다</div>
                  <button onClick={() => setShowActionMenu(true)}>
                    새 채팅 시작하기
                  </button>
                </div>
              ) : (
                getFilteredChats().map((chat) => (
                  <div
                    key={`${chat.type}-${chat.id}`}
                    className={`chat-item ${
                      selectedRoomId === chat.id ? "active" : ""
                    }`}
                    onClick={() => onRoomSelect(chat)}
                  >
                    <div className="profile-pic">
                      {chat.type === "channel"
                        ? "🏢"
                        : chat.otherUser?.name?.charAt(0) || "👤"}
                    </div>
                    <div className="chat-info">
                      <div className="chat-name">
                        {chat.type === "channel"
                          ? chat.channelName
                          : chat.otherUser?.name || "알 수 없음"}
                        {chat.type === "channel" && chat.memberCount && (
                          <span className="member-count">
                            ({chat.memberCount}명)
                          </span>
                        )}
                      </div>
                      <div className="chat-preview">
                        {chat.lastMessage?.content || "채팅을 시작해보세요!"}
                      </div>
                    </div>
                    <div className="chat-meta">
                      <div className="chat-time">
                        {chat.lastMessage?.createdAt
                          ? formatLastMessageTime(chat.lastMessage.createdAt)
                          : ""}
                      </div>
                      {chat.unreadCount > 0 && (
                        <div className="unread-badge">
                          {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                        </div>
                      )}
                      {/* 채널 설정/나가기 버튼 */}
                      {chat.type === "channel" && (
                        <button
                          className="channel-settings-btn"
                          onClick={(e) => openChannelSettings(chat, e)}
                          title="채널 설정"
                        >
                          ⚙️
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            // 연락처 목록
            <div className="contact-list">
              {filteredContacts.length === 0 ? (
                <div className="empty-state">
                  <div>👥</div>
                  <div>연락처가 없습니다</div>
                  <button onClick={() => setShowAddContact(true)}>
                    친구 추가하기
                  </button>
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="contact-item"
                    onClick={() => onContactSelect?.(contact)}
                  >
                    <div className="contact-avatar">
                      {contact.contactUser?.profileImage ? (
                        <img
                          src={contact.contactUser.profileImage}
                          alt={contact.contactName}
                        />
                      ) : (
                        contact.contactName?.charAt(0) || "C"
                      )}
                    </div>
                    <div className="contact-info">
                      <div className="contact-name">
                        {contact.contactName || contact.contactUser?.name}
                      </div>
                      <div className="contact-details">
                        {contact.contactUser?.department}
                        {contact.contactUser?.position &&
                          ` · ${contact.contactUser.position}`}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </aside>

      {/* 모달들 */}
      {showAddContact && (
        <AddContactModal
          onClose={() => setShowAddContact(false)}
          onContactAdded={() => {
            loadContacts();
            setShowAddContact(false);
          }}
          currentUser={currentUser}
        />
      )}

      {showCreateChannel && (
        <CreateChannelModal
          onClose={() => setShowCreateChannel(false)}
          onChannelCreated={handleChannelCreated}
          currentUser={currentUser}
        />
      )}

      {showCreateDM && (
        <CreateDMModal
          onClose={() => setShowCreateDM(false)}
          onDMCreated={handleDMCreated}
          currentUser={currentUser}
        />
      )}

      {showChannelSettings && selectedChannel && (
        <ChannelSettingsModal
          onClose={() => {
            setShowChannelSettings(false);
            setSelectedChannel(null);
          }}
          channel={selectedChannel}
          currentUser={currentUser}
          onChannelUpdated={handleChannelUpdated}
        />
      )}
    </>
  );
};
