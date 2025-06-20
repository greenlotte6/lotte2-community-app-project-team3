import { useCallback, useEffect, useState } from "react";
import { BoardLayout } from "../../layouts/BoardLayout";
import { QuillEditor } from "../../components/board/QuillEditor";
import { useLoginStore } from "../../stores/useLoginStore";
import { useNavigate } from "react-router-dom";
import { postBoard } from "../../api/userAPI";

export const BoardWrite = () => {
  const user = useLoginStore((state) => state.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "", // 게시글 제목 필드
    content: "", // Quill 에디터의 내용을 저장할 필드
    category: "notice", // ✨ 게시판 카테고리 필드 추가 (기본값 설정) ✨
    master: "",
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
  }, [user]);

  // 폼 데이터 업데이트를 위한 콜백 함수
  const change_field = useCallback((fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  }, []);

  console.log("현재 게시글 내용 (body): ", formData.body); // 디버깅용

  // 폼 제출 핸들러
  const handleSubmit = async () => {
    const payload = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      master: formData.master,
      writer: formData.writer,
    };

    console.log("전송 데이터:", payload);

    try {
      const result = await postBoard(payload);
      console.log("📌 저장 결과:", result);
      alert("게시글이 등록되었습니다.");
      navigate("/board/main");
    } catch (err) {
      alert("게시글 저장에 실패했습니다.");
    }
  };

  return (
    <BoardLayout>
      <main className="main-content" id="test-container">
        <div className="quill-field">
          <h1>새 게시글 작성</h1>

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

          <div className="selection">
            <div className="category">
              <label>게시판 : </label>
              <select
                value={formData.category}
                onChange={(e) => change_field("category", e.target.value)}
              >
                <option value="">-- 선택하세요 --</option>
                <option value="notice">공지사항</option>
                <option value="free">자유게시판</option>
                <option value="menu">식단표</option>
              </select>
            </div>
            <div className="master">
              <label>게시판 관리자 : </label>
              <select
                value={formData.master}
                onChange={(e) => change_field("master", e.target.value)}
              >
                <option value="">-- 선택하세요 --</option>
                <option value="admin1">김그린</option>
                <option value="admin2">이그린</option>
                <option value="admin3">장그린</option>
              </select>
            </div>
          </div>

          {/* Quill 에디터 컴포넌트 사용 */}
          <div className="content-field">
            <label>내용:</label>

            {/* ✅ 툴바 DOM 먼저 추가 */}
            <div id="quill-toolbar">
              <span className="ql-formats">
                <button className="ql-bold" />
                <button className="ql-italic" />
                <button className="ql-underline" />
              </span>
              <span className="ql-formats">
                <button className="ql-list" value="ordered" />
                <button className="ql-list" value="bullet" />
              </span>
              <span className="ql-formats">
                <button className="ql-link" />
                <button className="ql-clean" />
              </span>
            </div>

            {/* ✅ 에디터 본체 */}
            <QuillEditor change_field={change_field} />
          </div>

          {/* 작성 완료 버튼 */}
          <button className="submit" onClick={handleSubmit}>
            작성 완료
          </button>
        </div>
      </main>
    </BoardLayout>
  );
};
