import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { BoardLayout } from "../../layouts/BoardLayout";

export const Test = ({ change_field }) => {
  const quillElement = useRef(null);
  const quillInstance = useRef(null);

  useEffect(() => {
    quillInstance.current = new Quill(quillElement.current, {
      theme: "snow",
      placeholder: "내용을 입력하세요.",
      modules: {
        toolbar: [
          [{ header: ["1", "2", "3", false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block", "link", "image", "video"],
          [{ align: [] }, { color: [] }, { background: [] }, { font: [] }],
        ],
      },
    });
    const quill = quillInstance.current;
    quill.on("text-change", (delta, oldDelta, source) => {
      if (source === "user") {
        change_field("body", quill.root.innerHTML); //body
      }
    });
  }, [change_field]);

  return (
    <BoardLayout>
      <div ref={quillElement}></div>
    </BoardLayout>
  );
};
