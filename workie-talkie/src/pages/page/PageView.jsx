import React, { useCallback, useEffect, useState } from "react";
import { MainLayout } from "../../layouts/MainLayout";
import { Aside } from "../../components/page/Aside";
import { useNavigate, useParams } from "react-router-dom";
import { getPageByPno, putPage } from "../../api/userAPI";
import { ShareModal } from "../../components/page/ShareModal";
import { QuillEditor } from "../../components/board/QuillEditor";

console.log("📦 PageView 렌더링 시도됨");

export const PageView = () => {
  const { pno } = useParams();
  const [page, setPage] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "", // 여기서 body라고 쓸 거면 아래도 body로 유지해야 함
    deleted: false,
    shared: false,
    favorite: false,
  });

  useEffect(() => {
    console.log("🎯 useEffect 진입, pno:", pno);

    if (!pno || pno === "undefined") {
      console.warn("🚫 pno 값이 유효하지 않음:", pno);
      return;
    }

    getPageByPno(pno)
      .then((data) => {
        console.log("✅ getPageByPno 성공:", data);
        setPage(data);
      })
      .catch((err) => {
        console.error("❌ getPageByPno 실패:", err);
      });
  }, [pno]);

  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title || "",
        content: page.content || "",
        deleted: page.deleted,
        shared: page.shared,
        favorite: page.favorite,
      });
    }
  }, [page]);

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

    // ✨ pno를 숫자로 변환하고 유효성 검사 ✨
    const parsedPno = parseInt(pno, 10); // 10진수로 변환
    if (isNaN(parsedPno)) {
      console.error("🚫 pno가 유효한 숫자가 아닙니다:", pno);
      alert("페이지 번호가 올바르지 않아 저장할 수 없습니다.");
      return; // 유효하지 않으면 저장 요청을 보내지 않음
    }

    const requestData = {
      pno: parsedPno, // ✨ 변환된 pno 사용 ✨
      title: formData.title,
      content: formData.content,
      isDeleted: formData.deleted,
      isShared: formData.shared,
      isFavorite: formData.favorite,
    };

    //전송
    const fetchData = async () => {
      try {
        const data = await putPage(requestData);
        console.log(data);
        alert("페이지가 성공적으로 수정되었습니다!");
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
                    value={formData.title || ""}
                    onChange={(e) => change_field("title", e.target.value)}
                  />
                </div>

                {/* Quill 에디터 컴포넌트 사용 */}
                <div className="content-field">
                  <QuillEditor
                    value={formData.content}
                    change_field={change_field}
                  />
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
