import React, { useCallback, useState } from "react";
import { MainLayout } from "../../layouts/MainLayout";
import { Aside } from "../../components/page/Aside";
import { QuillEditor } from "../../components/board/QuillEditor";
import { ShareModal } from "../../components/page/ShareModal";
import { postPage } from "../../api/userAPI";

export const PageWrite = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "", // 게시글 제목 필드
    content: "", // Quill 에디터의 내용을 저장할 필드
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
  const submitHandler = (e) => {
    e.preventDefault();

    const requestData = {
      title: formData.title,
      content: formData.body,
      isDeleted: formData.deleted,
      isShared: formData.shared,
      isFavorite: formData.favorite,
    };

    //전송
    const fetchData = async () => {
      try {
        const data = await postPage(requestData);
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  };

  return (
    <MainLayout>
      <main className="main-content" id="writes">
        <div className="main-content-wrapper">
          <div className="notion-style-sidebar">
            <Aside />
          </div>

          <div className="main-editor-area">
            <main className="main-content" id="page-writes-container">
              <div className="quill-field">
                <div id="quill-toolbar">
                  <span className="ql-formats">
                    <select className="ql-header" defaultValue="">
                      <option value="1"></option>
                      <option value="2"></option>
                      <option value=""></option>
                    </select>
                    <button className="ql-bold" />
                    <button className="ql-italic" />
                    <button className="ql-underline" />
                    <button className="ql-strike" />
                  </span>
                  <span className="ql-formats">
                    <button className="ql-list" value="ordered" />
                    <button className="ql-list" value="bullet" />
                  </span>
                  <span className="ql-formats">
                    <button className="ql-blockquote" />
                    <button className="ql-code-block" />
                    <button className="ql-link" />
                    <button className="ql-image" />
                    <button className="ql-video" />
                  </span>
                  <span className="ql-formats">
                    <select className="ql-align"></select>
                    <select className="ql-color"></select>
                    <select className="ql-background"></select>
                    <select className="ql-font"></select>
                  </span>
                </div>
                <div className="main-header">
                  <button id="submitBtn" type="submit" onClick={submitHandler}>
                    <img src="/images/save.png" alt="저장" />
                  </button>
                  <button
                    className="share-btn"
                    id="shareBtn"
                    onClick={() => setIsShareModalOpen(true)}
                  >
                    <img src="/images/share.png" alt="공유" />
                  </button>
                </div>

                {/* 제목 입력 필드 */}
                <div className="title-field">
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
                  <QuillEditor change_field={change_field} />{" "}
                  {/* QuillEditor에 change_field 함수 전달 */}
                </div>
              </div>
            </main>

            {isShareModalOpen && (
              <div className="share-modal">
                <ShareModal onClose={() => setIsShareModalOpen(false)} />
              </div>
            )}
          </div>
        </div>
      </main>
    </MainLayout>
  );
};
