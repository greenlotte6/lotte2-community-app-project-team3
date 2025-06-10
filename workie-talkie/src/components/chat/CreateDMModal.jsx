// src/components/chat/CreateDMModal.jsx
import React, { useState, useEffect } from "react";

export const CreateDMModal = ({ onClose, onDMCreated, currentUser }) => {
  const [availableMembers, setAvailableMembers] = useState([]);
  const [existingDMs, setExistingDMs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // 🛡️ 안전장치
  if (!currentUser) {
    return (
      <div className="modal-overlay">
        <div className="modal-content dm-modal">
          <div className="modal-header">
            <h3>💬 DM 시작하기</h3>
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
    loadData();
  }, []);

  // 데이터 로드
  const loadData = async () => {
    setLoading(true);
    try {
      // 조직 멤버와 기존 DM 목록을 병렬로 로드
      const [membersResponse, dmsResponse] = await Promise.all([
        fetch("/api/contacts/organization-members", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/chat/dms", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      if (membersResponse.ok) {
        const members = await membersResponse.json();
        setAvailableMembers(members.filter((m) => m.id !== currentUser.id));
      }

      if (dmsResponse.ok) {
        const dms = await dmsResponse.json();
        setExistingDMs(dms.map((dm) => dm.otherUserId)); // 이미 DM이 있는 사용자 ID들
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // DM 생성
  const createDM = async (targetMember) => {
    // 이미 DM이 있는지 체크
    if (existingDMs.includes(targetMember.id)) {
      alert(`${targetMember.name}님과 이미 DM이 있습니다.`);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/chat/dms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          targetUserId: targetMember.id,
        }),
      });

      if (response.ok) {
        const dm = await response.json();
        alert(`${targetMember.name}님과 DM을 시작했습니다!`);
        onDMCreated(dm);
      } else {
        const error = await response.json();
        alert(error.message || "DM 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("DM 생성 실패:", error);
      alert("DM 생성에 실패했습니다.");
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
      <div className="modal-content dm-modal">
        <div className="modal-header">
          <h3>💬 DM 시작하기</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* 멤버 검색 */}
          <div className="member-search">
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
              filteredMembers.map((member) => {
                const hasExistingDM = existingDMs.includes(member.id);

                return (
                  <div
                    key={member.id}
                    className={`member-item ${hasExistingDM ? "disabled" : ""}`}
                    onClick={() => !hasExistingDM && createDM(member)}
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
                    <div className="dm-status">
                      {hasExistingDM ? (
                        <span className="existing-dm">✅ DM 있음</span>
                      ) : (
                        <button className="start-dm-btn">💬 DM 시작</button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 안내 메시지 */}
          <div className="dm-info">
            <p>
              💡 DM(Direct Message)은 특정 멤버와 1:1로 대화하는 기능입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
