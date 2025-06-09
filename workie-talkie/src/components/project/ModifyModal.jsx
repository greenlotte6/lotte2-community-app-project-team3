import React from "react";

export const ModifyModal = () => {
  return (
    <div className="modal-overlay" id="editModal">
      <div className="edit-modal">
        <div className="modal-header">
          <div className="modal-icon">✏️</div>
          <div className="modal-title">프로젝트 편집</div>
          <div className="modal-subtitle">프로젝트 정보를 수정해보세요</div>
        </div>

        <div className="modal-body">
          <div className="form-section">
            <label className="form-label">프로젝트 이름 *</label>
            <input
              type="text"
              id="editProjectName"
              className="form-input"
              placeholder="프로젝트 이름을 입력하세요"
              maxlength="50"
            />
          </div>

          <div className="form-section">
            <label className="form-label">프로젝트 설명</label>
            <textarea
              id="editProjectDescription"
              className="form-input"
              placeholder="프로젝트에 대한 간단한 설명을 입력하세요"
              rows="3"
              maxlength="200"
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
        </div>

        <div className="modal-actions">
          <button className="modal-btn modal-btn-cancel" id="cancelEditBtn">
            취소
          </button>
          <button className="modal-btn modal-btn-save" id="saveEditBtn">
            저장
          </button>
        </div>
      </div>
    </div>
  );
};
