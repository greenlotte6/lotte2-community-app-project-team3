import React from "react";
import { Link } from "react-router-dom";
import "../../styles/user/completeModal.scss"; // 이 모달을 위한 SCSS 파일

export const CompleteModal = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose} id="completeModal">
      <div
        className="complete-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <div className="modal-body">
          <h3>가입이 완료되었습니다!</h3>
          <p>지금 바로 로그인하여 서비스를 이용해보세요.</p>
          <Link to="/user/login">
            {/* 로그인 페이지로 이동 */}
            <button className="go-login-btn" onClick={onClose}>
              로그인
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
