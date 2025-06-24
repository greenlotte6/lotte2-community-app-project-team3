import { useCallback, useEffect, useState } from "react";
import { BoardLayout } from "../../layouts/BoardLayout";
import { QuillEditor } from "../../components/board/QuillEditor";
import { useLoginStore } from "../../stores/useLoginStore";
import { useNavigate } from "react-router-dom";
import { postBoard } from "../../api/boardAPI";
import "quill/dist/quill.snow.css";

export const BoardWrite = () => {
  const user = useLoginStore((state) => state.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "", // 게시글 제목 필드
    content: "", // Quill 에디터의 내용을 저장할 필드
    category: "notice", // ✨ 게시판 카테고리 필드 추가 (기본값 설정) ✨
    pinned: false,
  });

  useEffect(() => {
    if (!user) {
      navigate("/user/login");
    }

    if (user?.username) {
      setFormData((prev) => ({
        ...prev,
        writer: user.username, // 또는 user.id
      }));
    }
  }, [user, navigate]);

  // 폼 데이터 업데이트를 위한 콜백 함수
  const change_field = useCallback((fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  }, []);

  console.log("현재 게시글 내용 (content): ", formData.content); // 디버깅용

  const pinnedHandler = () => {
    setFormData((prev) => ({
      ...prev,
      pinned: !prev.pinned,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async () => {
    const payload = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      pinned: formData.pinned,
      writer: formData.writer,
    };

    console.log("전송 데이터:", payload);

    try {
      const result = await postBoard(payload);
      console.log("📌 저장 결과:", result);
      alert("게시글이 등록되었습니다.");
      navigate("/board/main");
    } catch (err) {
      console.log.error(err);
      alert("게시글 저장에 실패했습니다.");
    }
  };

  return (
    <BoardLayout>
      <main className="main-content" id="test-container">
        <div className="quill-field">
          <h1>새 게시글 작성</h1>

          <article className="main-area">
            <div className="selection">
              <div className="category">
                <label>게시판 : </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={(e) => change_field("category", e.target.value)}
                >
                  <option value="">-- 선택하세요 --</option>
                  <option value="notice">공지사항</option>
                  <option value="free">자유게시판</option>
                  <option value="menu">식단표</option>
                </select>
              </div>
              {/* ✅ 공지사항일 때만 보여줌 */}
              {formData.category === "notice" && (
                <div
                  className="master"
                  onClick={pinnedHandler}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={
                      formData.pinned ? "/images/pinned.png" : "/images/pin.png"
                    }
                    alt="게시물 고정"
                  />
                </div>
              )}
              {/* ✅ 식단표일 때만 보여줌 */}
              {formData.category === "menu" && (
                <div>
                  <p>글 양식 : </p>
                  <div className="form">
                    <p>[2025.06.24 (화)]</p>
                    <p>밥, 국, 반찬1, 반찬2, 반찬3</p>
                  </div>
                </div>
              )}
            </div>

            {/* 제목 입력 필드 */}
            <div className="title-field"></div>

            <div className="content-field">
              {/* Quill 에디터 컴포넌트 사용 */}
              <label>제목:</label>
              <input
                id="title-input"
                type="text"
                placeholder="제목을 입력하세요"
                value={formData.title}
                onChange={(e) => change_field("title", e.target.value)}
              />

              {/* ✅ 툴바 DOM 먼저 추가 */}
              <div id="quill-toolbar">
                <span className="ql-formats">
                  <select className="ql-size">
                    <option value="small"></option>
                    <option defaultValue></option> {/* 기본 (normal) */}
                    <option value="large"></option>
                    <option value="huge"></option>
                  </select>
                </span>
                <span className="ql-formats">
                  <button className="ql-bold" />
                  <button className="ql-italic" />
                  <button className="ql-underline" />
                  <button className="ql-strike" />
                  <button className="ql-clean" />
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

              {/* ✅ 에디터 본체 */}
              <QuillEditor change_field={change_field} />
            </div>

            {/* 작성 완료 버튼 */}
            <button className="submit" onClick={handleSubmit}>
              작성 완료
            </button>
          </article>
        </div>
      </main>
    </BoardLayout>
  );
};
