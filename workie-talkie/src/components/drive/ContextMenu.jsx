import React, { useEffect, useRef } from "react";

export const ContextMenu = ({
  position,
  visible,
  onClose,
  onDelete,
  onRename,
  onDownload,
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        position: "absolute",
        display: "block",
        zIndex: 999,
        background: "white",
        border: "1px solid #ccc",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      }}
    >
      <button onClick={onDelete}>🗑️ 삭제</button>
      <button onClick={onRename}>✏️ 이름 변경</button>
      <button onClick={onDownload}>⬇️ 내려받기</button>
    </div>
  );
};
