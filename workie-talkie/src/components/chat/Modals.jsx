import React, { useState, useEffect } from "react";
import {
  X,
  Search,
  Plus,
  Minus,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { useChat } from "../../context/ChatContext";
import dmService from "../../service/dmService";
import channelService from "../../service/channelService";

// 사용자 검색 컴포넌트
const UserSearch = ({
  onUserSelect,
  excludeUsers = [],
  placeholder = "사용자 검색...",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // 검색 실행
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const users = await dmService.searchUsers(query);
      // 제외할 사용자들 필터링
      const filteredUsers = users.filter(
        (user) =>
          !excludeUsers.some(
            (excludeUser) =>
              excludeUser.id === user.id ||
              excludeUser.employeeId === user.employeeId
          )
      );
      setSearchResults(filteredUsers);
    } catch (error) {
      console.error("❌ 사용자 검색 실패:", error);
      setSearchError("사용자 검색에 실패했습니다.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 디바운싱된 검색
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="user-search">
      <div className="search-input-container">
        <Search className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {isSearching && <Loader2 className="loading-icon animate-spin" />}
      </div>

      {searchError && (
        <div className="search-error">
          <AlertCircle className="error-icon" />
          <span>{searchError}</span>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((user) => (
            <div
              key={user.id || user.employeeId}
              className="search-result-item"
              onClick={() => onUserSelect(user)}
            >
              <div className="user-avatar">
                {user.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                {user.email && <div className="user-email">{user.email}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {searchQuery &&
        !isSearching &&
        searchResults.length === 0 &&
        !searchError && <div className="no-results">검색 결과가 없습니다.</div>}
    </div>
  );
};

// 선택된 멤버 표시 컴포넌트
const SelectedMembers = ({ members, onRemove, maxMembers, isPremium }) => {
  const isLimitReached = !isPremium && members.length >= maxMembers;

  return (
    <div className="selected-members">
      <div className="members-header">
        <span className="members-count">
          선택된 멤버 ({members.length}/{isPremium ? "무제한" : maxMembers}명)
        </span>
        {isLimitReached && (
          <span className="limit-warning">
            무료 회원은 최대 {maxMembers}명까지 추가할 수 있습니다.
          </span>
        )}
      </div>

      <div className="members-list">
        {members.map((member) => (
          <div key={member.id || member.employeeId} className="member-chip">
            <span className="member-name">{member.name}</span>
            <button
              onClick={() => onRemove(member)}
              className="remove-member-btn"
            >
              <X className="remove-icon" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 채널 생성 모달
const ChannelModal = () => {
  const {
    currentUser,
    showChannelModal,
    setShowChannelModal,
    refreshChannels,
  } = useChat();
  const [channelName, setChannelName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const maxMembers = 3;

  const handleUserSelect = (user) => {
    if (!currentUser.isPremium && selectedMembers.length >= maxMembers) {
      setError(`무료 회원은 최대 ${maxMembers}명까지 추가할 수 있습니다.`);
      return;
    }

    // 이미 선택된 사용자인지 확인
    const isAlreadySelected = selectedMembers.some(
      (member) => member.id === user.id || member.employeeId === user.employeeId
    );

    if (isAlreadySelected) {
      setError("이미 선택된 사용자입니다.");
      return;
    }

    setSelectedMembers((prev) => [...prev, user]);
    setError(null);
  };

  const handleRemoveMember = (memberToRemove) => {
    setSelectedMembers((prev) =>
      prev.filter(
        (member) =>
          member.id !== memberToRemove.id &&
          member.employeeId !== memberToRemove.employeeId
      )
    );
    setError(null);
  };

  const handleCreateChannel = async () => {
    if (!channelName.trim()) {
      setError("채널명을 입력해주세요.");
      return;
    }

    if (channelName.length < 2) {
      setError("채널명은 2자 이상이어야 합니다.");
      return;
    }

    if (channelName.length > 20) {
      setError("채널명은 20자 이하여야 합니다.");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const channelData = {
        name: channelName.trim(),
        memberIds: selectedMembers.map(
          (member) => member.id || member.employeeId
        ),
      };

      await channelService.createChannel(channelData);

      // 성공 시 모달 닫기 및 상태 초기화
      setShowChannelModal(false);
      setChannelName("");
      setSelectedMembers([]);

      // 채널 목록 새로고침
      if (refreshChannels) {
        refreshChannels();
      }
    } catch (error) {
      console.error("❌ 채널 생성 실패:", error);
      setError(error.message || "채널 생성에 실패했습니다.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setShowChannelModal(false);
    setChannelName("");
    setSelectedMembers([]);
    setError(null);
  };

  if (!showChannelModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal modal-large">
        <div className="modal-header">
          <h2 className="modal-title">새 채널 만들기</h2>
          <button onClick={handleClose} className="close-button">
            <X className="close-icon" />
          </button>
        </div>

        <div className="modal-content">
          {error && (
            <div className="error-message">
              <AlertCircle className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label className="label">채널명</label>
            <input
              type="text"
              className="input"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="채널명을 입력하세요"
              maxLength={20}
            />
            <div className="char-count">{channelName.length}/20</div>
          </div>

          <div className="form-group">
            <label className="label">멤버 추가</label>
            <UserSearch
              onUserSelect={handleUserSelect}
              excludeUsers={[currentUser, ...selectedMembers]}
              placeholder="추가할 멤버를 검색하세요..."
            />
          </div>

          {selectedMembers.length > 0 && (
            <SelectedMembers
              members={selectedMembers}
              onRemove={handleRemoveMember}
              maxMembers={maxMembers}
              isPremium={currentUser.isPremium}
            />
          )}

          <div className="modal-actions">
            <button
              onClick={handleCreateChannel}
              disabled={!channelName.trim() || isCreating}
              className="btn btn-primary"
            >
              {isCreating ? (
                <>
                  <Loader2 className="btn-icon animate-spin" />
                  생성 중...
                </>
              ) : (
                <>
                  <Plus className="btn-icon" />
                  채널 만들기
                </>
              )}
            </button>
            <button onClick={handleClose} className="btn btn-secondary">
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// DM 시작 모달
const DMModal = () => {
  const { currentUser, showDmModal, setShowDmModal, refreshDMs } = useChat();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const handleUserSelect = async (user) => {
    setIsCreating(true);
    setError(null);

    try {
      await dmService.createOrGetDMRoom(user.id || user.employeeId);

      // 성공 시 모달 닫기
      setShowDmModal(false);

      // DM 목록 새로고침
      if (refreshDMs) {
        refreshDMs();
      }
    } catch (error) {
      console.error("❌ DM 시작 실패:", error);
      setError(error.message || "DM 시작에 실패했습니다.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setShowDmModal(false);
    setError(null);
  };

  if (!showDmModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">새 다이렉트 메시지</h2>
          <button onClick={handleClose} className="close-button">
            <X className="close-icon" />
          </button>
        </div>

        <div className="modal-content">
          {error && (
            <div className="error-message">
              <AlertCircle className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          {isCreating && (
            <div className="creating-message">
              <Loader2 className="loading-icon animate-spin" />
              <span>DM을 시작하는 중...</span>
            </div>
          )}

          <div className="form-group">
            <label className="label">대화 상대 선택</label>
            <UserSearch
              onUserSelect={handleUserSelect}
              excludeUsers={[currentUser]}
              placeholder="대화를 시작할 사용자를 검색하세요..."
            />
          </div>

          <div className="modal-actions">
            <button onClick={handleClose} className="btn btn-secondary">
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
  const { showLeaveModal, setShowLeaveModal, refreshChannels } = useChat();
  const [isLeaving, setIsLeaving] = useState(false);
  const [error, setError] = useState(null);

  const handleLeaveChannel = async () => {
    if (!showLeaveModal) return;

    setIsLeaving(true);
    setError(null);

    try {
      await channelService.leaveChannel(showLeaveModal);

      // 성공 시 모달 닫기
      setShowLeaveModal(false);

      // 채널 목록 새로고침
      if (refreshChannels) {
        refreshChannels();
      }
    } catch (error) {
      console.error("❌ 채널 나가기 실패:", error);
      setError(error.message || "채널 나가기에 실패했습니다.");
    } finally {
      setIsLeaving(false);
    }
  };

  const handleClose = () => {
    setShowLeaveModal(false);
    setError(null);
  };

  if (!showLeaveModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal confirm-modal">
        <div className="modal-header">
          <h2 className="modal-title">채널에서 나가시겠습니까?</h2>
        </div>

        <div className="modal-content">
          {error && (
            <div className="error-message">
              <AlertCircle className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          <p className="confirm-text">
            채널에서 나가면 더 이상 메시지를 받을 수 없습니다. 채널 소유자인
            경우 다른 멤버에게 소유권이 이전됩니다.
          </p>

          <div className="modal-actions">
            <button
              onClick={handleLeaveChannel}
              disabled={isLeaving}
              className="btn btn-danger"
            >
              {isLeaving ? (
                <>
                  <Loader2 className="btn-icon animate-spin" />
                  나가는 중...
                </>
              ) : (
                "나가기"
              )}
            </button>
            <button onClick={handleClose} className="btn btn-secondary">
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
