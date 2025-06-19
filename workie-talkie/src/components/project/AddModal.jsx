import React, { useState, useEffect } from "react";

export const AddModal = ({ onClose, onProjectAdded }) => {
  // 상태 관리
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "web",
    collaborators: [], // 사용자 객체 배열
  });

  const [selectedType, setSelectedType] = useState("web");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 사용자 검색 관련 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // 프로젝트 이름 변경
  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData((prev) => ({ ...prev, name }));
  };

  // 프로젝트 설명 변경
  const handleDescriptionChange = (e) => {
    const description = e.target.value;
    setFormData((prev) => ({ ...prev, description }));
  };

  // 프로젝트 타입 선택
  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setFormData((prev) => ({ ...prev, type }));
  };

  // 사용자 검색 함수
  const searchUsers = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/users/search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const users = await response.json();
        // 이미 선택된 사용자들은 제외
        const filteredUsers = users.filter(
          (user) =>
            !formData.collaborators.some((selected) => selected.id === user.id)
        );
        setSearchResults(filteredUsers);
        setShowResults(true);
        console.log("✅ 사용자 검색 성공:", filteredUsers);
      } else {
        console.error("❌ 사용자 검색 실패:", response.status);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("❌ 사용자 검색 오류:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 검색어 변경 시 디바운싱
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, formData.collaborators]);

  // 사용자 선택
  const handleUserSelect = (user) => {
    setFormData((prev) => ({
      ...prev,
      collaborators: [...prev.collaborators, user],
    }));
    setSearchTerm("");
    setShowResults(false);
    console.log("👤 사용자 추가:", user);
  };

  // 사용자 제거
  const handleUserRemove = (userId) => {
    setFormData((prev) => ({
      ...prev,
      collaborators: prev.collaborators.filter((user) => user.id !== userId),
    }));
    console.log("🗑️ 사용자 제거:", userId);
  };

  // 폼 제출
  const handleSubmit = async () => {
    // 입력 검증
    if (!formData.name.trim()) {
      alert("프로젝트 이름을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("📤 전송할 데이터:", formData);

      const token = localStorage.getItem("token");

      // 🔥 백엔드에 맞는 형태로 데이터 변환
      const requestData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        collaboratorIds: formData.collaborators.map((user) => user.id), // ID만 전송
      };

      const response = await fetch("http://localhost:8080/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔥 토큰 추가
        },
        body: JSON.stringify(requestData),
      });

      console.log("📥 응답 상태:", response.status);

      if (response.ok) {
        const newProject = await response.json();
        console.log("✅ 생성된 프로젝트:", newProject);

        alert("프로젝트가 성공적으로 생성되었습니다!");

        // 부모 컴포넌트에 새 프로젝트 전달
        if (onProjectAdded) {
          onProjectAdded(newProject);
        }

        onClose();
      } else {
        const errorText = await response.text();
        console.error("❌ 에러 응답:", errorText);
        alert("프로젝트 생성에 실패했습니다: " + errorText);
      }
    } catch (error) {
      console.error("❌ 요청 실패:", error);
      alert("네트워크 오류가 발생했습니다: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 버튼 활성화 상태
  const isButtonEnabled = formData.name.trim() && !isSubmitting;

  return (
    <div className="modal-overlay" id="projectModal" onClick={onClose}>
      <div className="project-modal large" onClick={(e) => e.stopPropagation()}>
        <style>{`
          .project-modal.large {
            max-width: 600px;
            width: 90%;
          }
          
          .user-search-container {
            position: relative;
          }
          
          .user-search-input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.2s;
            box-sizing: border-box;
          }
          
          .user-search-input:focus {
            outline: none;
            border-color: #007bff;
          }
          
          .search-results {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e1e5e9;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            margin-top: 4px;
          }
          
          .search-result-item {
            padding: 12px 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: background-color 0.2s;
            border-bottom: 1px solid #f1f3f5;
          }
          
          .search-result-item:hover {
            background-color: #f8f9fa;
          }
          
          .search-result-item:last-child {
            border-bottom: none;
          }
          
          .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
          }
          
          .user-info {
            flex: 1;
          }
          
          .user-name {
            font-weight: 500;
            color: #2c3e50;
            margin-bottom: 2px;
          }
          
          .user-email {
            font-size: 12px;
            color: #6c757d;
          }
          
          .selected-users {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
            min-height: 60px;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e1e5e9;
          }
          
          .selected-user-tag {
            display: flex;
            align-items: center;
            gap: 6px;
            background: #007bff;
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
          }
          
          .selected-user-tag .user-avatar {
            width: 20px;
            height: 20px;
            font-size: 10px;
          }
          
          .remove-user-btn {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 16px;
            line-height: 1;
            padding: 0;
            margin-left: 4px;
            opacity: 0.8;
            transition: opacity 0.2s;
          }
          
          .remove-user-btn:hover {
            opacity: 1;
          }
          
          .empty-state {
            text-align: center;
            color: #6c757d;
            font-size: 13px;
            padding: 16px;
            width: 100%;
          }
          
          .searching-indicator, .no-results {
            padding: 12px 16px;
            text-align: center;
            color: #6c757d;
            font-size: 13px;
          }
          
          .project-types {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-top: 8px;
          }
          
          .type-option {
            padding: 16px;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .type-option:hover {
            border-color: #007bff;
            background-color: #f8f9fa;
          }
          
          .type-option.selected {
            border-color: #007bff;
            background-color: #e3f2fd;
          }
          
          .type-icon {
            font-size: 24px;
            margin-bottom: 8px;
          }
          
          .type-name {
            font-size: 13px;
            font-weight: 500;
            color: #495057;
          }
          
          .debug-info {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 5px;
            font-size: 12px;
            margin-top: 16px;
            border: 1px solid #e9ecef;
          }
        `}</style>

        <div className="modal-header">
          <div className="modal-icon">📁</div>
          <div className="modal-title">새 프로젝트 생성</div>
          <div className="modal-subtitle">새로운 프로젝트를 시작해보세요</div>
        </div>

        <div className="modal-body">
          <div className="form-section">
            <label className="form-label">프로젝트 이름 *</label>
            <input
              type="text"
              className="form-input"
              placeholder="프로젝트 이름을 입력하세요"
              maxLength={100}
              value={formData.name}
              onChange={handleNameChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-section">
            <label className="form-label">프로젝트 설명</label>
            <textarea
              className="form-input"
              placeholder="프로젝트에 대한 간단한 설명을 입력하세요 (선택사항)"
              rows={3}
              maxLength={500}
              value={formData.description}
              onChange={handleDescriptionChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-section">
            <label className="form-label">프로젝트 타입 *</label>
            <div className="project-types">
              {[
                { type: "web", icon: "🌐", name: "웹 개발" },
                { type: "mobile", icon: "📱", name: "모바일" },
                { type: "design", icon: "🎨", name: "디자인" },
                { type: "data", icon: "📊", name: "데이터" },
                { type: "ai", icon: "🤖", name: "AI/ML" },
                { type: "other", icon: "📋", name: "기타" },
              ].map(({ type, icon, name }) => (
                <div
                  key={type}
                  className={`type-option ${
                    selectedType === type ? "selected" : ""
                  }`}
                  onClick={() => !isSubmitting && handleTypeSelect(type)}
                >
                  <div className="type-icon">{icon}</div>
                  <div className="type-name">{name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">팀 멤버 초대</label>
            <div className="user-search-container">
              <input
                type="text"
                className="user-search-input"
                placeholder="사용자 이름 또는 ID로 검색... (2글자 이상 입력)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm && setShowResults(true)}
                disabled={isSubmitting}
              />

              {/* 검색 결과 */}
              {showResults && (
                <div className="search-results">
                  {isSearching ? (
                    <div className="searching-indicator">🔍 검색 중...</div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="search-result-item"
                        onClick={() => handleUserSelect(user)}
                      >
                        <div className="user-avatar">
                          {user.name
                            ? user.name.charAt(0).toUpperCase()
                            : user.id.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                          <div className="user-name">
                            {user.name || user.id}
                          </div>
                          <div className="user-email">
                            {user.email || `@${user.id}`}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-results">검색 결과가 없습니다</div>
                  )}
                </div>
              )}

              {/* 선택된 사용자들 */}
              <div className="selected-users">
                {formData.collaborators.length === 0 ? (
                  <div className="empty-state">
                    아직 초대된 멤버가 없습니다.
                    <br />
                    사용자를 검색하여 팀원을 초대해보세요.
                  </div>
                ) : (
                  formData.collaborators.map((user) => (
                    <div key={user.id} className="selected-user-tag">
                      <div className="user-avatar">
                        {user.name
                          ? user.name.charAt(0).toUpperCase()
                          : user.id.charAt(0).toUpperCase()}
                      </div>
                      {user.name || user.id}
                      <button
                        className="remove-user-btn"
                        onClick={() => handleUserRemove(user.id)}
                        title="제거"
                        disabled={isSubmitting}
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 디버깅 정보 */}
          <div className="debug-info">
            <strong>🔍 현재 입력값:</strong>
            <br />
            이름: {formData.name || "(없음)"}
            <br />
            설명: {formData.description || "(없음)"}
            <br />
            타입: {formData.type}
            <br />
            초대된 멤버: {formData.collaborators.length}명
            {formData.collaborators.length > 0 && (
              <>
                {" "}
                ({formData.collaborators.map((u) => u.name || u.id).join(", ")})
              </>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="modal-btn modal-btn-cancel"
            onClick={onClose}
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            className="modal-btn modal-btn-create"
            onClick={handleSubmit}
            disabled={!isButtonEnabled}
          >
            {isSubmitting ? "생성 중..." : "프로젝트 생성"}
          </button>
        </div>
      </div>
    </div>
  );
};
