// src/components/chat/NewChatModal.jsx
import React, { useState, useEffect } from "react";

export const NewChatModal = ({ onClose, onRoomCreated, currentUser }) => {
  const [chatType, setChatType] = useState("direct");
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 🛡️ 안전장치: currentUser가 없으면 로딩 화면
  if (!currentUser) {
    return (
      <div className="modal-overlay">
        <div className="modal-content new-chat-modal">
          <div className="modal-header">
            <h3>💬 새 채팅</h3>
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
          <div className="modal-body">
            <div style={{ textAlign: "center", padding: "20px" }}>
              <div>⏳ 사용자 정보를 불러오는 중...</div>
              <button
                onClick={onClose}
                style={{ marginTop: "10px", padding: "5px 10px" }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const response = await fetch("/api/contacts", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts || []);
      } else {
        setContacts([]);
      }
    } catch (error) {
      console.error("연락처 로드 실패:", error);
      setContacts([]);
    }
  };

  const toggleContactSelection = (contact) => {
    setSelectedContacts((prev) => {
      const isSelected = prev.some((c) => c.id === contact.id);
      if (isSelected) {
        return prev.filter((c) => c.id !== contact.id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const createDirectChat = async (contact) => {
    try {
      const response = await fetch("/api/chat/rooms/direct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ targetUserId: contact.contactUser?.id }),
      });

      if (response.ok) {
        const room = await response.json();
        if (onRoomCreated) onRoomCreated(room);
      } else {
        alert("채팅방 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("1:1 채팅 생성 실패:", error);
      alert("채팅방 생성에 실패했습니다.");
    }
  };

  const createGroupChat = async () => {
    if (selectedContacts.length === 0 || !groupName.trim()) {
      alert("그룹명과 참여자를 선택해주세요.");
      return;
    }

    try {
      const response = await fetch("/api/chat/rooms/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          roomName: groupName,
          participants: selectedContacts
            .map((c) => c.contactUser?.id)
            .filter(Boolean),
        }),
      });

      if (response.ok) {
        const room = await response.json();
        if (onRoomCreated) onRoomCreated(room);
      } else {
        alert("그룹 채팅 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("그룹 채팅 생성 실패:", error);
      alert("그룹 채팅 생성에 실패했습니다.");
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.contactUser?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content new-chat-modal">
        <div className="modal-header">
          <h3>💬 새 채팅</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* 채팅 타입 선택 */}
          <div className="chat-type-tabs">
            <button
              className={`type-tab ${chatType === "direct" ? "active" : ""}`}
              onClick={() => setChatType("direct")}
            >
              👤 1:1 채팅
            </button>
            <button
              className={`type-tab ${chatType === "group" ? "active" : ""}`}
              onClick={() => setChatType("group")}
            >
              👥 그룹 채팅
            </button>
          </div>

          {/* 그룹 채팅 설정 */}
          {chatType === "group" && (
            <div className="group-settings">
              <input
                type="text"
                placeholder="그룹 채팅방 이름"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="group-name-input"
              />

              {selectedContacts.length > 0 && (
                <div className="selected-contacts">
                  <div className="selected-label">선택된 참여자:</div>
                  <div className="selected-list">
                    {selectedContacts.map((contact) => (
                      <span
                        key={contact.id || Math.random()}
                        className="selected-contact"
                      >
                        {contact.contactName ||
                          contact.contactUser?.name ||
                          "이름 없음"}
                        <button onClick={() => toggleContactSelection(contact)}>
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 연락처 검색 */}
          <div className="contact-search">
            <input
              type="text"
              placeholder="연락처 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 연락처 목록 */}
          <div className="contact-selection-list">
            {filteredContacts.length === 0 ? (
              <div
                style={{ textAlign: "center", padding: "20px", color: "#666" }}
              >
                연락처가 없습니다.
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id || Math.random()}
                  className={`contact-selection-item ${
                    chatType === "group" &&
                    selectedContacts.some((c) => c.id === contact.id)
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => {
                    if (chatType === "direct") {
                      createDirectChat(contact);
                    } else {
                      toggleContactSelection(contact);
                    }
                  }}
                >
                  <div className="contact-avatar">
                    {contact.contactUser?.profileImage ? (
                      <img
                        src={contact.contactUser.profileImage}
                        alt={contact.contactName || "Contact"}
                      />
                    ) : (
                      (
                        contact.contactUser?.name ||
                        contact.contactName ||
                        "C"
                      ).charAt(0)
                    )}
                  </div>
                  <div className="contact-info">
                    <div className="contact-name">
                      {contact.contactName ||
                        contact.contactUser?.name ||
                        "이름 없음"}
                    </div>
                    <div className="contact-details">
                      {contact.contactUser?.department || ""}
                      {contact.contactUser?.position &&
                        ` · ${contact.contactUser.position}`}
                    </div>
                  </div>
                  {chatType === "group" && (
                    <div className="selection-indicator">
                      {selectedContacts.some((c) => c.id === contact.id)
                        ? "✅"
                        : "⭕"}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* 그룹 채팅 생성 버튼 */}
          {chatType === "group" && (
            <div className="group-create-section">
              <button
                className="create-group-btn"
                onClick={createGroupChat}
                disabled={selectedContacts.length === 0 || !groupName.trim()}
              >
                그룹 채팅 만들기 ({selectedContacts.length}명)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
