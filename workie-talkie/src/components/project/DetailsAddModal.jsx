import React from "react";

export const DetailsAddModal = ({ onClose }) => {
  return (
    <div className="modal-overlay" id="taskModal" onClick={onClose}>
      <div className="task-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">새 작업 추가</div>
          <div className="modal-subtitle">새로운 작업을 생성해보세요</div>
        </div>

        <div className="modal-form">
          <div className="form-group">
            <label className="form-label" for="taskTitle">
              작업 제목 *
            </label>
            <input
              type="text"
              id="taskTitle"
              className="form-input"
              placeholder="작업 제목을 입력하세요"
              maxlength="100"
            />
          </div>

          <div className="form-group">
            <label className="form-label" for="taskContent">
              작업 내용
            </label>
            <textarea
              id="taskContent"
              className="form-input form-textarea"
              placeholder="작업에 대한 자세한 설명을 입력하세요 (선택사항)"
              maxlength="500"
            ></textarea>
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="modal-btn modal-btn-cancel"
            id="cancelTaskBtn"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="modal-btn modal-btn-save"
            id="saveTaskBtn"
            disabled
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};
