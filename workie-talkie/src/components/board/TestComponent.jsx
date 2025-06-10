import React, { useCallback, useState } from "react";

export const TestComponent = () => {
  const [formData, setFormData] = useState({
    title: "",
    body: "", //Quill 에디터의 내용을 저장할 필드
  });

  const change_field = useCallback((filedName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [filedName]: value,
    }));
  }, []);

  console.log("Current body content : ", formData.body);

  return (
    <div>
      <h1>게시글 작성</h1>
      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={formData.title}
        onChange={(e) => change_field("title", e.target.value)}
      />
      <Test change_field={change_field} />{" "}
      {/* change_field 함수를 props로 전달 */}
      <button onClick={() => console.log("Submitting:", formData)}>
        작성 완료
      </button>
    </div>
  );
};
