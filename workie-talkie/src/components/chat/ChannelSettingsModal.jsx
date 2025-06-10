// src/components/chat/ChannelSettingsModal.jsx
import React, { useState, useEffect } from "react";

export const ChannelSettingsModal = ({
  onClose,
  channel,
  currentUser,
  onChannelUpdated,
}) => {
  const [channelMembers, setChannelMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNewOwner, setSelectedNewOwner] = useState(null);

  // 현재 사용자가 채널 개설자인지 확인
  const isChannelOwner = channel?.creatorId === currentUser?.id;

  useEffect(() => {
    loadChannelMembers();
  }, [channel]);

  // 채널 멤버 목록 로드
  const loadChannelMembers = async () => {
    if (!channel?.id) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/chat/channels/${channel.id}/members`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.ok) {
        const members = await response.json();
        setChannelMembers(members);
      }
    } catch (error) {
      console.error("채널 멤버 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 채널장 이임
  const transferOwnership = async () => {
    if (!selectedNewOwner) {
      alert("새 채널장을 선택해주세요.");
      return;
    }

    const confirmed = confirm(
      `정말 ${selectedNewOwner.name}님에게 채널장 권한을 이임하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/chat/channels/${channel.id}/transfer-ownership`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            newOwnerId: selectedNewOwner.id,
          }),
        }
      );

      if (response.ok) {
        alert(`${selectedNewOwner.name}님에게 채널장 권한을 이임했습니다.`);
        onChannelUpdated();
        onClose();
      } else {
        const error = await response.json();
        alert(error.message || "채널장 이임에 실패했습니다.");
      }
    } catch (error) {
      console.error("채널장 이임 실패:", error);
      alert("채널장 이임에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 채널 나가기 (채널장용 - 이임 후 나가기)
  const leaveChannelAsOwner = async () => {
    if (!selectedNewOwner) {
      alert("채널장을 다른 멤버에게 이임한 후 나가실 수 있습니다.");
      return;
    }

    const confirmed = confirm(
      `${selectedNewOwner.name}님에게 채널장을 이임하고 채널을 나가시겠습니까?`
    );

    if (!confirmed) return;

    // 먼저 이임
    setLoading(true);
    try {
      const transferResponse = await fetch(
        `/api/chat/channels/${channel.id}/transfer-ownership`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            newOwnerId: selectedNewOwner.id,
          }),
        }
      );

      if (transferResponse.ok) {
        // 이임 성공 시 채널 나가기
        const leaveResponse = await fetch(
          `/api/chat/channels/${channel.id}/leave`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (leaveResponse.ok) {
          alert(
            `${selectedNewOwner.name}님에게 채널장을 이임하고 채널을 나갔습니다.`
          );
          onChannelUpdated();
          onClose();
        } else {
          alert("채널 나가기에 실패했습니다.");
        }
      } else {
        const error = await transferResponse.json();
        alert(error.message || "채널장 이임에 실패했습니다.");
      }
    } catch (error) {
      console.error("채널장 이임 및 나가기 실패:", error);
      alert("작업에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 일반 멤버 채널 나가기
  const leaveChannel = async () => {
    const confirmed = confirm("정말 이 채널을 나가시겠습니까?");
    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/chat/channels/${channel.id}/leave`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.ok) {
        alert("채널에서 나갔습니다.");
        onChannelUpdated();
        onClose();
      } else {
        const error = await response.json();
        alert(error.message || "채널 나가기에 실패했습니다.");
      }
    } catch (error) {
      console.error("채널 나가기 실패:", error);
      alert("채널 나가기에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!channel) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content channel-settings-modal">
        <div className="modal-header">
          <h3>🏢 채널 설정</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* 채널 정보 */}
          <div className="channel-info">
            <h4>📋 채널 정보</h4>
            <div className="info-row">
              <span className="label">채널명:</span>
              <span className="value">{channel.channelName}</span>
            </div>
            <div className="info-row">
              <span className="label">멤버 수:</span>
              <span className="value">{channelMembers.length}명</span>
            </div>
            <div className="info-row">
              <span className="label">개설자:</span>
              <span className="value">
                {channelMembers.find((m) => m.id === channel.creatorId)?.name ||
                  "알 수 없음"}
                {isChannelOwner && " (나)"}
              </span>
            </div>
          </div>

          {/* 멤버 목록 */}
          <div className="channel-members">
            <h4>👥 채널 멤버</h4>
            {loading ? (
              <div className="loading-state">⏳ 멤버 목록을 불러오는 중...</div>
            ) : (
              <div className="member-list">
                {channelMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`member-item ${
                      isChannelOwner && selectedNewOwner?.id === member.id
                        ? "selected"
                        : ""
                    } ${
                      isChannelOwner && member.id === currentUser.id
                        ? "disabled"
                        : ""
                    }`}
                    onClick={() => {
                      if (isChannelOwner && member.id !== currentUser.id) {
                        setSelectedNewOwner(
                          selectedNewOwner?.id === member.id ? null : member
                        );
                      }
                    }}
                  >
                    <div className="member-avatar">
                      {member.profileImage ? (
                        <img src={member.profileImage} alt={member.name} />
                      ) : (
                        member.name?.charAt(0) || "M"
                      )}
                    </div>
                    <div className="member-info">
                      <div className="member-name">
                        {member.name}
                        {member.id === channel.creatorId && " 👑"}
                        {member.id === currentUser.id && " (나)"}
                      </div>
                      <div className="member-details">
                        {member.department}{" "}
                        {member.position && `· ${member.position}`}
                      </div>
                    </div>
                    {isChannelOwner && selectedNewOwner?.id === member.id && (
                      <div className="selected-indicator">
                        ✅ 새 채널장으로 선택됨
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 채널장 전용 기능 */}
          {isChannelOwner && (
            <div className="owner-actions">
              <h4>👑 채널장 전용 기능</h4>

              {selectedNewOwner ? (
                <div className="transfer-info">
                  <p>
                    🔄 <strong>{selectedNewOwner.name}</strong>님을 새
                    채널장으로 선택했습니다.
                  </p>
                </div>
              ) : (
                <div className="transfer-help">
                  <p>💡 위 멤버 목록에서 새 채널장을 선택해주세요.</p>
                </div>
              )}

              <div className="action-buttons">
                <button
                  className="transfer-btn"
                  onClick={transferOwnership}
                  disabled={!selectedNewOwner || loading}
                >
                  👑 채널장 이임하기
                </button>

                <button
                  className="leave-as-owner-btn"
                  onClick={leaveChannelAsOwner}
                  disabled={!selectedNewOwner || loading}
                >
                  🚪 이임 후 나가기
                </button>
              </div>

              <p className="help-text">
                💡 채널장은 다른 멤버에게 권한을 이임한 후에만 채널을 나갈 수
                있습니다.
              </p>
            </div>
          )}

          {/* 일반 멤버 기능 */}
          {!isChannelOwner && (
            <div className="member-actions">
              <button
                className="leave-btn"
                onClick={leaveChannel}
                disabled={loading}
              >
                🚪 채널 나가기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
