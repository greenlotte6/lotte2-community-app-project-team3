import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

/**
 * 재사용 가능한 Quill 에디터 컴포넌트
 * @param {object} props
 * @param {string} props.value - 초기값으로 세팅할 콘텐츠
 * @param {(fieldName: string, value: any) => void} props.change_field - 부모 컴포넌트의 상태를 업데이트할 콜백 함수
 */
export const QuillEditor = ({ value = "", change_field }) => {
  const editorRef = useRef(null); // Quill 에디터가 렌더링될 DOM 엘리먼트 참조
  const quillInstance = useRef(null); // Quill 인스턴스 참조

  useEffect(() => {
    // 1. Quill 인스턴스가 아직 없으면 초기화
    if (!quillInstance.current) {
      // #quill-toolbar 엘리먼트가 존재하고, Quill이 해당 엘리먼트를 찾을 수 있도록 합니다.
      // 이 useEffect는 PageView에서 QuillEditor가 렌더링될 때 한 번만 실행되어야 합니다.
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow", // 테마 설정
        placeholder: "내용을 입력하세요.", // 플레이스홀더 텍스트
        modules: {
          toolbar: {
            container: "#quill-toolbar", // ✨ 중요한 부분: 외부 툴바 ID 지정 ✨
          },
        },
      });

      const quill = quillInstance.current;

      // 초기값 설정 (최초 마운트 시에만)
      if (value) {
        quill.root.innerHTML = value;
      }

      // 텍스트 내용 변경 이벤트 리스너 등록
      quill.on("text-change", (delta, oldDelta, source) => {
        // 사용자 입력에 의한 변경일 경우에만 부모 상태 업데이트
        if (source === "user") {
          change_field("content", quill.root.innerHTML); // 'content' 필드에 에디터의 HTML 내용 전달
        }
      });
    }

    // 컴포넌트 언마운트 시 Quill 인스턴스 정리 (메모리 누수 방지)
    return () => {
      if (quillInstance.current) {
        // 인스턴스 파괴 (선택 사항이지만 더 깔끔한 정리를 위해)
        // quillInstance.current.off('text-change');
        // quillInstance.current.destroy(); // Quill 2.0+ 에서 지원
        quillInstance.current = null;
        if (editorRef.current) {
          editorRef.current.innerHTML = ""; // DOM 내용 비우기
        }
      }
    };
  }, []); // 빈 의존성 배열: 컴포넌트 마운트 시 한 번만 실행

  // 'value' prop이 변경될 때 Quill 에디터 내용 업데이트 (외부에서 데이터가 변경될 때)
  useEffect(() => {
    const editor = quillInstance.current;
    // 에디터가 초기화되었고, 현재 에디터 내용과 props.value가 다를 때만 업데이트
    if (editor && editor.root.innerHTML !== value) {
      const selection = editor.getSelection(); // 커서 위치 저장
      editor.root.innerHTML = value;
      if (selection) {
        // 커서 위치 복원
        editor.setSelection(selection.index, selection.length);
      }
    }
  }, [value]); // value prop이 변경될 때마다 실행

  // Quill 에디터가 렌더링될 DOM 엘리먼트
  return <div ref={editorRef} id="quill-editor-area"></div>; // ID를 부여하여 명확하게 구분
};
