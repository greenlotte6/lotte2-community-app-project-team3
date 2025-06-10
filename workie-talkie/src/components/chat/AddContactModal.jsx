// src/components/chat/AddContactModal.jsx
import React, { useState, useEffect } from "react";

// UserSearchItem을 같은 파일 내부에 정의
const UserSearchItem = ({ user, onAddFriend, currentUser }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddFriend = async () => {
    setIsAdding(true);
    try {
      await onAddFriend(user);
    } catch (error) {
      console.error("친구 추가 실패:", error);
    } finally {
      setIsAdding(false);
    }
  };

  // 안전장치: user나 currentUser가 없으면 렌더링하지 않음
  if (!user || !currentUser) {
    return null;
  }

  return (
    <div className="user-search-item">
      <div className="user-avatar">
        {user.profileImage ? (
          <img src={user.profileImage} alt={user.name || "User"} />
        ) : (
          (user.name || "U").charAt(0)
        )}
      </div>
      <div className="user-info">
        <div className="user-name">{user.name || "이름 없음"}</div>
        <div className="user-details">
          {user.email || ""}
          {user.department && ` · ${user.department}`}
          {user.organization?.orgName && ` · ${user.organization.orgName}`}
        </div>
      </div>
      <button
        className="add-friend-btn"
        onClick={handleAddFriend}
        disabled={isAdding || user.id === currentUser.id}
      >
        {isAdding ? "⏳" : "➕"}
      </button>
    </div>
  );
};

// 메인 AddContactModal 컴포넌트
export const AddContactModal = ({ onClose, onContactAdded, currentUser }) => {
  const [searchMethod, setSearchMethod] = useState("search");
  const [searchTerm, setSearchTerm] = useState("");
  const [userCode, setUserCode] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [orgMembers, setOrgMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🛡️ 최우선 안전장치: currentUser가 없으면 로딩 화면
  if (!currentUser) {
    return (
      <div className="modal-overlay">
        <div className="modal-content contact-modal">
          <div className="modal-header">
            <h3>👥 친구 추가</h3>
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

  // 안전한 사용자 정보 추출
  const safeCurrentUser = {
    id: currentUser.id || 0,
    name: currentUser.name || "사용자",
    userCode: currentUser.userCode || `USER${currentUser.id || ""}`,
    organization: currentUser.organization || { orgName: "조직" },
  };

  // 조직 멤버 로드
  useEffect(() => {
    if (searchMethod === "organization") {
      loadOrganizationMembers();
    }
  }, [searchMethod]);

  // 사용자 검색
  const searchUsers = async () => {
    if (searchTerm.trim().length < 2) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/users/search?q=${searchTerm}&type=contact`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.ok) {
        const users = await response.json();
        setSearchResults(users || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("사용자 검색 실패:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 사용자 코드로 검색
  const searchByUserCode = async () => {
    if (!userCode.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/users/by-code/${userCode}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.ok) {
        const user = await response.json();
        setSearchResults([user]);
      } else if (response.status === 404) {
        setSearchResults([]);
        alert("해당 사용자 코드를 찾을 수 없습니다.");
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("사용자 코드 검색 실패:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 조직 멤버 로드
  const loadOrganizationMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/contacts/organization-members", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.ok) {
        const members = await response.json();
        setOrgMembers(members || []);
      } else {
        setOrgMembers([]);
      }
    } catch (error) {
      console.error("조직 멤버 로드 실패:", error);
      setOrgMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // 친구 요청 보내기
  const sendFriendRequest = async (targetUser) => {
    try {
      const response = await fetch("/api/friends/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          targetUserId: targetUser.id,
          message:
            message || `${safeCurrentUser.name}님이 친구 요청을 보냈습니다.`,
        }),
      });

      if (response.ok) {
        alert(`${targetUser.name || "사용자"}님에게 친구 요청을 보냈습니다.`);
        if (onContactAdded) onContactAdded();
      } else if (response.status === 409) {
        alert("이미 친구이거나 요청이 진행 중입니다.");
      } else {
        alert("친구 요청에 실패했습니다.");
      }
    } catch (error) {
      console.error("친구 요청 실패:", error);
      alert("친구 요청에 실패했습니다.");
    }
  };

  // 조직 멤버 자동 추가
  const addOrganizationMember = async (member) => {
    try {
      const response = await fetch("/api/contacts/add-colleague", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          targetUserId: member.id,
        }),
      });

      if (response.ok) {
        alert(`${member.name || "사용자"}님을 연락처에 추가했습니다.`);
        if (onContactAdded) onContactAdded();
      } else {
        alert("연락처 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error("연락처 추가 실패:", error);
      alert("연락처 추가에 실패했습니다.");
    }
  };

  // 클립보드 복사 (안전장치 포함)
  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        alert("복사되었습니다!");
      } else {
        // fallback
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("복사되었습니다!");
      }
    } catch (error) {
      console.error("복사 실패:", error);
      alert("복사에 실패했습니다.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content contact-modal">
        <div className="modal-header">
          <h3>👥 친구 추가</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* 추가 방법 선택 */}
          <div className="method-tabs">
            <button
              className={`method-tab ${
                searchMethod === "search" ? "active" : ""
              }`}
              onClick={() => setSearchMethod("search")}
            >
              🔍 검색
            </button>
            <button
              className={`method-tab ${
                searchMethod === "code" ? "active" : ""
              }`}
              onClick={() => setSearchMethod("code")}
            >
              🏷️ 코드
            </button>
            <button
              className={`method-tab ${
                searchMethod === "organization" ? "active" : ""
              }`}
              onClick={() => setSearchMethod("organization")}
            >
              🏢 우리 조직
            </button>
          </div>

          {/* 내 사용자 코드 표시 */}
          <div className="my-code-section">
            <div className="my-code-label">내 사용자 코드</div>
            <div className="my-code-value">
              {safeCurrentUser.userCode}
              <button
                className="copy-btn"
                onClick={() => copyToClipboard(safeCurrentUser.userCode)}
              >
                📋
              </button>
            </div>
          </div>

          {/* 검색 영역 */}
          {searchMethod === "search" && (
            <div className="search-section">
              <div className="search-input-group">
                <input
                  type="text"
                  placeholder="이름, 이메일, 전화번호로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchUsers()}
                />
                <button onClick={searchUsers} disabled={loading}>
                  {loading ? "⏳" : "🔍"}
                </button>
              </div>

              <div className="message-input">
                <textarea
                  placeholder="친구 요청 메시지 (선택사항)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="search-results">
                {searchResults.map((user) => (
                  <UserSearchItem
                    key={user.id || Math.random()}
                    user={user}
                    onAddFriend={sendFriendRequest}
                    currentUser={safeCurrentUser}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 사용자 코드 검색 */}
          {searchMethod === "code" && (
            <div className="code-section">
              <div className="search-input-group">
                <input
                  type="text"
                  placeholder="사용자 코드 입력 (예: USER123)"
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === "Enter" && searchByUserCode()}
                />
                <button onClick={searchByUserCode} disabled={loading}>
                  {loading ? "⏳" : "🔍"}
                </button>
              </div>

              <div className="search-results">
                {searchResults.map((user) => (
                  <UserSearchItem
                    key={user.id || Math.random()}
                    user={user}
                    onAddFriend={sendFriendRequest}
                    currentUser={safeCurrentUser}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 조직 멤버 */}
          {searchMethod === "organization" && (
            <div className="organization-section">
              <div className="org-info">
                🏢 {safeCurrentUser.organization.orgName} 멤버들
              </div>

              <div className="org-members">
                {orgMembers.map((member) => (
                  <div
                    key={member.id || Math.random()}
                    className="org-member-item"
                  >
                    <div className="member-avatar">
                      {member.profileImage ? (
                        <img
                          src={member.profileImage}
                          alt={member.name || "Member"}
                        />
                      ) : (
                        (member.name || "M").charAt(0)
                      )}
                    </div>
                    <div className="member-info">
                      <div className="member-name">
                        {member.name || "이름 없음"}
                      </div>
                      <div className="member-details">
                        {member.department || ""}{" "}
                        {member.position ? `· ${member.position}` : ""}
                      </div>
                    </div>
                    <button
                      className="add-colleague-btn"
                      onClick={() => addOrganizationMember(member)}
                    >
                      ➕
                    </button>
                  </div>
                ))}

                {orgMembers.length === 0 && !loading && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#666",
                    }}
                  >
                    조직 멤버가 없습니다.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
