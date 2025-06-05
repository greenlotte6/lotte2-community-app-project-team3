import React, { useEffect, useState } from "react";
import "../../styles/setting/addPage.scss";
import { SharedMembersInput } from "./SharedMembersInput";

export const AddPageModal = ({ onClose }) => {
  // 모달 내부에서 사용할 상태들
  const [shareScope, setShareScope] = useState("all");
  const [sharedMembers, setSharedMembers] = useState([]);
  const [pageName, setPageName] = useState(""); // 페이지명 상태 추가
  const [pageDescription, setPageDescription] = useState(""); // 페이지 설명 상태 추가
  const [writePermission, setWritePermission] =
    useState("관리자 및 페이지마스터만"); // 작성 권한 상태 추가

  const handleShareScopeChange = (event) => {
    setShareScope(event.target.value);
    if (event.target.value !== "member") {
      setSharedMembers([]);
    }
  };

  const handleSave = () => {
    const confirmed = window.confirm("저장하시겠습니까?");
    if (confirmed) {
      console.log("저장 데이터:", {
        pageName: pageName, // 상태에서 값 가져오기
        pageDescription: pageDescription, // 상태에서 값 가져오기
        shareScope: shareScope,
        writePermission: writePermission, // 상태에서 값 가져오기
        sharedMembers: sharedMembers,
      });
      alert("저장되었습니다.");
      onClose(); // 저장 후 모달 닫기
    }
  };

  return (
    // 모달 오버레이 div
    <div className="modal-overlay" onClick={onClose}>
      {/* 모달 컨텐츠 div (클릭 시 모달이 닫히지 않도록 이벤트 전파 방지) */}
      <div
        className="add-page-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <div className="title">
          <h1>페이지 추가</h1>
        </div>
        <div className="page-setting">
          <div className="page">
            <div className="body">
              <div>
                <h4>페이지명</h4>
                <input
                  type="text"
                  placeholder="페이지명을 입력해 주세요."
                  value={pageName} // 상태와 연결
                  onChange={(e) => setPageName(e.target.value)} // 상태 업데이트
                />
              </div>
              <div>
                <h4>페이지 설명</h4>
                <input
                  type="text"
                  placeholder="설명을 입력해 주세요."
                  value={pageDescription} // 상태와 연결
                  onChange={(e) => setPageDescription(e.target.value)} // 상태 업데이트
                />
              </div>
              <div>
                <h4>공유 범위</h4>
                <select
                  id="shareScope"
                  value={shareScope}
                  onChange={handleShareScopeChange}
                >
                  <option value="all">전체공개</option>
                  <option value="none">비공개</option>
                  <option value="member">멤버공개</option>
                </select>
              </div>
              {shareScope === "member" && (
                <SharedMembersInput
                  sharedMembers={sharedMembers}
                  setSharedMembers={setSharedMembers}
                />
              )}
              <div>
                <h4>작성 권한</h4>
                <select
                  value={writePermission} // 상태와 연결
                  onChange={(e) => setWritePermission(e.target.value)} // 상태 업데이트
                >
                  <option>관리자 및 페이지마스터만</option>
                  <option>전체</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="btn">
          <button onClick={handleSave}>S A V E</button>
        </div>
      </div>
    </div>
  );
};
