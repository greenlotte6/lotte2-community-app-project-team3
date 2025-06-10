// src/components/chat/CreateChannelModal.jsx
import React, { useState, useEffect } from "react";

export const CreateChannelModal = ({
  onClose,
  onChannelCreated,
  currentUser,
}) => {
  const [channelName, setChannelName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // 🛡️ 안전장치
  if (!currentUser) {
    return (
      <div className="modal-overlay">
        <div className="modal-content channel-modal">
          <div className="modal-header">
            <h3>🏢 채널 만들기</h3>
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
          <div className="modal-body">
            <div style={{ textAlign: "center", padding: "20px" }}>
              ⏳ 사용자 정보를 불러오는 중...
            </div>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    loadAvailableMembers();
  }, []);

  // 조직 멤버 로드
  const loadAvailableMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/contacts/organization-members", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.ok) {
        const members = await response.json();
        // 자신 제외
        setAvailableMembers(members.filter((m) => m.id !== currentUser.id));
      }
    } catch (error) {
      console.error("멤버 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 멤버 선택/해제 (제한 없음)
  const toggleMemberSelection = (member) => {
    setSelectedMembers((prev) => {
      const isSelected = prev.some((m) => m.id === member.id);

      if (isSelected) {
        return prev.filter((m) => m.id !== member.id);
      } else {
        return [...prev, member];
      }
    });
  };

  // 채널 생성
  const createChannel = async () => {
    if (!channelName.trim()) {
      alert("채널명을 입력해주세요.");
      return;
    }

    if (selectedMembers.length === 0) {
      alert("최소 1명의 멤버를 추가해주세요.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/chat/channels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          channelName: channelName.trim(),
          members: selectedMembers.map((m) => m.id),
          creatorId: currentUser.id,
        }),
      });

      if (response.ok) {
        const channel = await response.json();
        alert(`"${channelName}" 채널이 생성되었습니다!`);
        onChannelCreated(channel);
      } else {
        const error = await response.json();
        alert(error.message || "채널 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("채널 생성 실패:", error);
      alert("채널 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 필터링된 멤버 목록
  const filteredMembers = availableMembers.filter(
    (member) =>
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content channel-modal">
        <div className="modal-header">
          <h3>🏢 채널 만들기</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* 채널명 입력 */}
          <div className="channel-name-section">
            <label className="form-label">채널명</label>
            <input
              type="text"
              placeholder="예: 마케팅팀, 프로젝트A 등"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="channel-name-input"
              maxLength={50}
            />
          </div>

          {/* 선택된 멤버 표시 */}
          {selectedMembers.length > 0 && (
            <div className="selected-members">
              <label className="form-label">
                선택된 멤버 ({selectedMembers.length}명)
              </label>
              <div className="selected-member-list">
                {selectedMembers.map((member) => (
                  <span key={member.id} className="selected-member-tag">
                    {member.name}
                    <button onClick={() => toggleMemberSelection(member)}>
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 멤버 검색 */}
          <div className="member-search">
            <label className="form-label">멤버 추가</label>
            <input
              type="text"
              placeholder="이름이나 부서로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* 멤버 목록 */}
          <div className="member-list">
            {loading ? (
              <div className="loading-state">⏳ 멤버 목록을 불러오는 중...</div>
            ) : filteredMembers.length === 0 ? (
              <div className="empty-state">검색 결과가 없습니다.</div>
            ) : (
              filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className={`member-item ${
                    selectedMembers.some((m) => m.id === member.id)
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => toggleMemberSelection(member)}
                >
                  <div className="member-avatar">
                    {member.profileImage ? (
                      <img src={member.profileImage} alt={member.name} />
                    ) : (
                      member.name?.charAt(0) || "M"
                    )}
                  </div>
                  <div className="member-info">
                    <div className="member-name">{member.name}</div>
                    <div className="member-details">
                      {member.department}{" "}
                      {member.position && `· ${member.position}`}
                    </div>
                  </div>
                  <div className="selection-indicator">
                    {selectedMembers.some((m) => m.id === member.id)
                      ? "✅"
                      : "⭕"}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 생성 버튼 */}
          <div className="modal-actions">
            <button
              className="create-channel-btn"
              onClick={createChannel}
              disabled={
                loading || !channelName.trim() || selectedMembers.length === 0
              }
            >
              {loading
                ? "생성 중..."
                : `채널 만들기 (${selectedMembers.length + 1}명)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
