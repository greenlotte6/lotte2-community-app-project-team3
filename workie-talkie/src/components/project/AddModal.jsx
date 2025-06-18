import React from "react";

export const AddModal = ({ onClose }) => {
  return (
    <div className="modal-overlay" id="projectModal" onClick={onClose}>
      <div className="project-modal " onClick={(e) => e.stopPropagation()}>
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
              id="projectName"
              className="form-input"
              placeholder="프로젝트 이름을 입력하세요"
              maxLength={50}
            />
          </div>

          <div className="form-section">
            <label className="form-label">프로젝트 설명</label>
            <textarea
              id="projectDescription"
              className="form-input"
              placeholder="프로젝트에 대한 간단한 설명을 입력하세요 (선택사항)"
              rows={3}
              maxLength={200}
            ></textarea>
          </div>

          <div className="form-section">
            <label className="form-label">프로젝트 타입 *</label>
            <div className="project-types">
              <div className="type-option" data-type="web">
                <div className="type-icon">🌐</div>
                <div className="type-name">웹 개발</div>
              </div>
              <div className="type-option" data-type="mobile">
                <div className="type-icon">📱</div>
                <div className="type-name">모바일</div>
              </div>
              <div className="type-option" data-type="design">
                <div className="type-icon">🎨</div>
                <div className="type-name">디자인</div>
              </div>
              <div className="type-option" data-type="data">
                <div className="type-icon">📊</div>
                <div className="type-name">데이터</div>
              </div>
              <div className="type-option" data-type="ai">
                <div className="type-icon">🤖</div>
                <div className="type-name">AI/ML</div>
              </div>
              <div className="type-option" data-type="other">
                <div className="type-icon">📋</div>
                <div className="type-name">기타</div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">팀 멤버 초대</label>
            <div className="invite-section">
              <div className="invite-header">
                <span className="invite-title">이메일로 멤버 초대</span>
                <button className="invite-btn" type="button">
                  <span>📧</span>
                  초대 링크 생성
                </button>
              </div>

              <div className="invite-input-container">
                <input
                  type="email"
                  className="invite-input"
                  placeholder="이메일 주소를 입력하세요"
                  id="memberEmail"
                />
                <button
                  className="add-member-btn"
                  type="button"
                  id="addMemberBtn"
                >
                  추가
                </button>
              </div>

              <div className="invited-members" id="invitedMembers">
                <div className="empty-members">
                  아직 초대된 멤버가 없습니다.
                  <br />
                  이메일을 입력하여 팀원을 초대해보세요.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="modal-btn modal-btn-cancel"
            id="cancelProjectBtn"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="modal-btn modal-btn-create"
            id="createProjectBtn"
            disabled
          >
            프로젝트 생성
          </button>
        </div>
      </div>
    </div>
  );
};
