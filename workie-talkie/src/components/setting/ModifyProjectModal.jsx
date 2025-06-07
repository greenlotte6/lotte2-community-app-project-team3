import React, { useEffect, useState } from "react";
import "../../styles/setting/modals.scss";
import { SharedMembersInput } from "./SharedMembersInput";

export const ModifyProjectModal = ({ onClose }) => {
  // 모달 내부에서 사용할 상태들
  const [shareScope, setShareScope] = useState("all");
  const [sharedMembers, setSharedMembers] = useState([]);
  const [projectTitle, setProjectTitle] = useState(""); // 페이지명 상태 추가
  const [projectInfo, setProjectInfo] = useState(""); // 페이지 설명 상태 추가
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
        projectTitle: projectTitle, // 상태에서 값 가져오기
        projectInfo: projectInfo, // 상태에서 값 가져오기
        shareScope: shareScope,
        writePermission: writePermission, // 상태에서 값 가져오기
        sharedMembers: sharedMembers,
      });
      alert("저장되었습니다.");
      onClose(); // 저장 후 모달 닫기
    }
  };

  const handleDelete = () => {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (confirmed) {
      // 여기에 삭제 로직 구현
      console.log("삭제 처리됨"); // 예시
      alert("삭제되었습니다.");
      onClose(); // 삭제 후 모달 닫기
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
          <h1>프로젝트 수정</h1>
        </div>
        <div className="page-setting">
          <div className="page">
            <div className="body">
              <div>
                <h4>프로젝트명</h4>
                <input
                  type="text"
                  name="projectTitle"
                  value={projectTitle}
                  placeholder="프로젝트명을 입력해 주세요."
                  onChange={(e) => setProjectTitle(e.target.value)}
                />
              </div>
              <div>
                <h4>프로젝트 내용</h4>
                <input
                  type="text"
                  name="projectInfo"
                  value={projectInfo}
                  placeholder="내용을 입력해 주세요."
                  onChange={(e) => setProjectInfo(e.target.value)}
                />
              </div>
              <div>
                <h4>팀원 공개 여부</h4>
                <label className="switch">
                  <input name="share" type="checkbox" />
                  <span className="slider round"></span>
                </label>
              </div>
              <div>
                <h4>프로젝트 기간</h4>
                <div className="dates">
                  <input
                    type="date"
                    name="startDate"
                    placeholder="내용을 입력해 주세요."
                  />
                  <img src="/images/right-arrow.png" alt="화살표" />
                  <input
                    type="date"
                    name="endDate"
                    placeholder="내용을 입력해 주세요."
                  />
                </div>
              </div>
              <div id="memberInputContainer">
                <div className="show-member-input">
                  <SharedMembersInput
                    sharedMembers={sharedMembers}
                    setSharedMembers={setSharedMembers}
                  />
                </div>
              </div>
              <div>
                <h4>삭제</h4>
                <label>
                  <button className="deleteBtn" onClick={handleDelete}>
                    삭제
                  </button>
                </label>
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
