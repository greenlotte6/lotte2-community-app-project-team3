import React, { useCallback, useState } from "react";
import { MainLayout } from "../../layouts/MainLayout";
import { Aside } from "../../components/page/Aside";
import { QuillEditor } from "../../components/board/QuillEditor";

export const PageWrite = () => {
  const [formData, setFormData] = useState({
    title: "", // 게시글 제목 필드
    body: "", // Quill 에디터의 내용을 저장할 필드
  });

  // 폼 데이터 업데이트를 위한 콜백 함수
  const change_field = useCallback((fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  }, []);

  console.log("현재 게시글 내용 (body): ", formData.body); // 디버깅용

  // 폼 제출 핸들러
  const handleSubmit = () => {
    console.log("게시글 제출 데이터:", formData);
    // 여기에 API 호출 등 게시글 저장 로직 추가
  };

  return (
    <MainLayout>
      <main className="main-content" id="writes">
        <div class="main-content-wrapper">
          <div className="notion-style-sidebar">
            <Aside />
          </div>

          <div class="main-editor-area">
            <div class="main-header">
              <button class="share-btn" id="shareBtn">
                공유하기
              </button>
            </div>
            <main className="main-content" id="test-container">
              <div className="quill-field">
                {/* 제목 입력 필드 */}
                <div className="title-field">
                  <label>제목:</label>
                  <input
                    id="title-input"
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={formData.title}
                    onChange={(e) => change_field("title", e.target.value)}
                  />
                </div>

                {/* Quill 에디터 컴포넌트 사용 */}
                <div className="content-field">
                  <label>내용:</label>
                  <QuillEditor change_field={change_field} />{" "}
                  {/* QuillEditor에 change_field 함수 전달 */}
                </div>

                {/* 작성 완료 버튼 */}
                <button onClick={handleSubmit}>작성 완료</button>
              </div>
            </main>

            <div class="share-modal" id="shareModal">
              <h3>공유하기</h3>
              <div class="share-input-group">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input
                  type="text"
                  placeholder="이름으로 구분된 이메일 또는 그룹"
                />
              </div>
              <ul class="share-permission-list">
                <li class="share-permission-item">
                  <div class="share-user-info">
                    <img
                      src="https://via.placeholder.com/30"
                      alt="User Avatar"
                    />
                    <span>user@gmail.com</span>
                  </div>
                  <div class="share-permission-dropdown">
                    <button id="permissionDropdownBtn">
                      전체 허용 <i class="fa-solid fa-angle-down"></i>
                    </button>
                    <ul class="share-permission-options" id="permissionOptions">
                      <li>전체 허용</li>
                      <li>편집 허용</li>
                      <li>댓글 허용</li>
                      <li>읽기 허용</li>
                      <li>사용 권한 없음</li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
};
