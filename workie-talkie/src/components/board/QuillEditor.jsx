import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

/**
 * 재사용 가능한 Quill 에디터 컴포넌트
 * @param {object} props
 * @param {(fieldName: string, value: any) => void} props.change_field - 부모 컴포넌트의 상태를 업데이트할 콜백 함수
 */

export const QuillEditor = ({ change_field }) => {
  const quillElement = useRef(null); // 에디터가 렌더링될 DOM 엘리먼트 참조
  const quillInstance = useRef(null); // Quill 인스턴스 참조

  useEffect(() => {
    if (quillInstance.current || quillElement.current?.firstChild) return;

    const toolbarOptions = [
      [{ header: ["1", "2", "3", false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block", "link", "image", "video"],
      [{ align: [] }, { color: [] }, { background: [] }, { font: [] }],
    ];

    // Quill 에디터 초기화
    quillInstance.current = new Quill(quillElement.current, {
      theme: "snow", // 테마 설정
      placeholder: "내용을 입력하세요.", // 플레이스홀더 텍스트
      modules: {
        toolbar: {
          container: "#quill-toolbar", // 외부 툴바 연결
        },
      },
    });

    const quill = quillInstance.current;

    // 텍스트 내용 변경 이벤트 리스너 등록
    quill.on("text-change", (delta, oldDelta, source) => {
      // 사용자 입력에 의한 변경일 경우에만 부모 상태 업데이트
      if (source === "user") {
        change_field("body", quill.root.innerHTML); // 'body' 필드에 에디터의 HTML 내용 전달
      }
    });

    // 컴포넌트 언마운트 시 Quill 인스턴스 정리 (메모리 누수 방지)
    return () => {
      if (quillInstance.current) {
        // Quill 에디터의 DOM 엘리먼트 내용도 비워 깔끔하게 정리
        if (quillElement.current) {
          quillElement.current.innerHTML = "";
        }
        quillInstance.current = null; // 인스턴스 참조 제거
      }
    };
  }, [change_field]); // change_field 함수가 변경될 때마다 useEffect 재실행 (useCallback으로 최적화됨)

  return <div ref={quillElement} id="qull-element"></div>;
};
