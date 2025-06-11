// components/Modals.jsx
import React from "react";
import { X } from "lucide-react";
import { useChat } from "../../context/ChatContext";

// 채널 추가 모달
const ChannelModal = () => {
  const {
    currentUser,
    showChannelModal,
    setShowChannelModal,
    newChannel,
    setNewChannel,
    availableMembers,
    handleAddChannel,
    toggleMember,
  } = useChat();

  if (!showChannelModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">새 채널 만들기</h2>
          <X
            className="close-icon"
            onClick={() => setShowChannelModal(false)}
          />
        </div>

        <div className="modal-content">
          <div className="form-group">
            <label className="label">채널명</label>
            <input
              type="text"
              className="input"
              value={newChannel.name}
              onChange={(e) =>
                setNewChannel({ ...newChannel, name: e.target.value })
              }
              placeholder="채널명을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label className="label">
              멤버 추가 ({newChannel.members.length}/
              {currentUser.isPremium ? "무제한" : "3"}명)
            </label>
            <div className="member-list">
              {availableMembers.map((member) => (
                <label key={member} className="member-item">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={newChannel.members.includes(member)}
                    onChange={() => toggleMember(member)}
                  />
                  <span className="member-name">{member}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button onClick={handleAddChannel} className="btn btn-primary">
              채널 만들기
            </button>
            <button
              onClick={() => setShowChannelModal(false)}
              className="btn btn-secondary"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// DM 추가 모달
const DMModal = () => {
  const {
    currentUser,
    showDmModal,
    setShowDmModal,
    newDm,
    setNewDm,
    dmList,
    availableMembers,
    handleAddDm,
  } = useChat();

  if (!showDmModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">새 다이렉트 메시지</h2>
          <X className="close-icon" onClick={() => setShowDmModal(false)} />
        </div>

        <div className="modal-content">
          <div className="form-group">
            <label className="label">
              멤버 선택 ({dmList.length}/
              {currentUser.isPremium ? "무제한" : "3"}개)
            </label>
            <select
              className="select"
              value={newDm}
              onChange={(e) => setNewDm(e.target.value)}
            >
              <option value="">멤버를 선택하세요</option>
              {availableMembers
                .filter((member) => !dmList.find((dm) => dm.name === member))
                .map((member) => (
                  <option key={member} value={member}>
                    {member}
                  </option>
                ))}
            </select>
          </div>

          <div className="modal-actions">
            <button onClick={handleAddDm} className="btn btn-primary">
              DM 시작하기
            </button>
            <button
              onClick={() => setShowDmModal(false)}
              className="btn btn-secondary"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 채널 나가기 확인 모달
const LeaveChannelModal = () => {
  const { showLeaveModal, setShowLeaveModal, handleLeaveChannel } = useChat();

  if (!showLeaveModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal confirm-modal">
        <div className="modal-header">
          <h2 className="modal-title">채널에서 나가시겠습니까?</h2>
        </div>
        <div className="modal-content">
          <p className="confirm-text">
            채널 개설자는 다른 멤버에게 관리자 권한이 이임됩니다.
          </p>
          <div className="modal-actions">
            <button
              onClick={() => handleLeaveChannel(showLeaveModal)}
              className="btn btn-danger"
            >
              나가기
            </button>
            <button
              onClick={() => setShowLeaveModal(false)}
              className="btn btn-secondary"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 모든 모달을 담는 컨테이너
const Modals = () => {
  return (
    <>
      <ChannelModal />
      <DMModal />
      <LeaveChannelModal />
    </>
  );
};

export default Modals;
