import { useCallback, useState } from "react";
import { BoardLayout } from "../../layouts/BoardLayout";
import { QuillEditor } from "../../components/board/QuillEditor";

export const Test = () => {
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
    <BoardLayout>
      <main className="main-content" id="board-write-page-container">
        <h1>새 게시글 작성</h1>

        {/* 제목 입력 필드 */}
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="title-input">제목:</label>
          <input
            id="title-input"
            type="text"
            placeholder="제목을 입력하세요"
            value={formData.title}
            onChange={(e) => change_field("title", e.target.value)}
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd" }}
          />
        </div>

        {/* Quill 에디터 컴포넌트 사용 */}
        <div style={{ marginBottom: "20px" }}>
          <label>내용:</label>
          <QuillEditor change_field={change_field} />{" "}
          {/* QuillEditor에 change_field 함수 전달 */}
        </div>

        {/* 작성 완료 버튼 */}
        <button onClick={handleSubmit}>작성 완료</button>
      </main>
    </BoardLayout>
  );
};
