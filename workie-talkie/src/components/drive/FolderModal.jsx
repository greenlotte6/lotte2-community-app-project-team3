import React, { useState } from "react";
import axiosInstance from "@/api/axiosInstance"; // 상대 경로는 프로젝트 구조에 맞게 조정

export const FolderModal = ({ onClose, onCreate, currentParentId = null }) => {
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmedName = folderName.trim();
    if (!trimmedName) {
      alert("폴더명을 입력해주세요.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/api/drive/folder", null, {
        params: {
          name: trimmedName,
          parentId: currentParentId || null,
        },
      });

      const createdFolderId = response.data;

      const newFolder = {
        dno: createdFolderId,
        name: trimmedName,
        type: "FOLDER",
        parentId: currentParentId,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
        size: 0,
      };

      onCreate(newFolder);
      setFolderName("");
      onClose();
    } catch (error) {
      console.error("폴더 생성 실패:", error);
      alert("폴더 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      style={{ display: "flex" }}
      onClick={onClose}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>새 폴더 추가</span>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <input
            type="text"
            placeholder="폴더명을 입력해주세요."
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            취소
          </button>
          <button
            className="confirm-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "생성 중..." : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
};
