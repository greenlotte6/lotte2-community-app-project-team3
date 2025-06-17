import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginStore } from "@/stores/useLoginStore";

import { DriveLayout } from "../../layouts/DriveLayout";
import { DriveHeader } from "../../components/drive/DriveHeader";
import { DriveTable } from "../../components/drive/DriveTable";
import { FolderModal } from "../../components/drive/FolderModal";
import { RenameModal } from "../../components/drive/RenameModal";
import axiosInstance from "@/api/axiosInstance";

const Drivepage = () => {
  const navigate = useNavigate();
  const user = useLoginStore((state) => state.user); // 로그인 여부 확인
  const [activeTab, setActiveTab] = useState("⭐ 내 드라이브");
  const [folders, setFolders] = useState([]);
  const [trash, setTrash] = useState([]);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameIndex, setRenameIndex] = useState(null);

  // ✅ 로그인 확인
  useEffect(() => {
    if (!user) {
      alert("로그인이 필요한 기능입니다.");
      navigate("/user/login");
    }
  }, [user, navigate]);

  // ✅ 폴더 목록 불러오기
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axiosInstance.get("/api/drive", {
          params: { parentId: null },
        });
        setFolders(response.data);
      } catch (error) {
        console.error("폴더 조회 실패:", error);
        alert("폴더 데이터를 불러오지 못했습니다.");
      }
    };

    if (activeTab === "⭐ 내 드라이브") {
      fetchFolders();
    }
  }, [activeTab]);

  // ✅ 폴더 생성
  const handleAddFolder = async (name) => {
    try {
      const response = await axiosInstance.post("/drive/folder", null, {
        params: {
          name,
          parentId: null,
        },
      });

      const newFolderId = response.data;
      const now = new Date().toISOString();

      const newFolder = {
        dno: newFolderId,
        name,
        type: "FOLDER",
        parentId: null,
        createdAt: now,
        modifiedAt: now,
        size: 0,
      };

      setFolders((prev) => [...prev, newFolder]);
      setShowFolderModal(false);
    } catch (error) {
      console.error("폴더 생성 실패:", error);
      alert("폴더 생성 중 오류가 발생했습니다.");
    }
  };

  // ✅ 이름 변경 (로컬 상태)
  const handleRenameFolder = (newName) => {
    const updated = [...folders];
    updated[renameIndex].name = newName;
    updated[renameIndex].modifiedAt = new Date().toISOString();
    setFolders(updated);
    setRenameIndex(null);
    setShowRenameModal(false);
  };

  // ✅ 삭제 (로컬 상태)
  const handleDelete = (indexes) => {
    const toTrash = indexes.map((i) => folders[i]);
    setTrash([...trash, ...toTrash]);
    setFolders(folders.filter((_, i) => !indexes.includes(i)));
    setSelectedIndexes([]);
  };

  // ✅ 복원 (로컬 상태)
  const handleRestore = (indexes) => {
    const toRestore = indexes.map((i) => trash[i]);
    setFolders([...folders, ...toRestore]);
    setTrash(trash.filter((_, i) => !indexes.includes(i)));
    setSelectedIndexes([]);
  };

  return user ? (
    <DriveLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <DriveHeader
        activeTab={activeTab}
        selectedIndexes={selectedIndexes}
        onOpenFolderModal={() => setShowFolderModal(true)}
        onDelete={handleDelete}
        onRestore={handleRestore}
        onRename={(index) => {
          setRenameIndex(index);
          setShowRenameModal(true);
        }}
      />
      <DriveTable
        activeTab={activeTab}
        folders={folders}
        trash={trash}
        selectedIndexes={selectedIndexes}
        setSelectedIndexes={setSelectedIndexes}
        onRequestRename={(index) => {
          setRenameIndex(index);
          setShowRenameModal(true);
        }}
        onRequestRestore={handleRestore}
        onRequestDelete={handleDelete}
      />
      {showFolderModal && (
        <FolderModal
          onClose={() => setShowFolderModal(false)}
          onCreate={handleAddFolder}
        />
      )}
      {showRenameModal && renameIndex !== null && (
        <RenameModal
          folderName={folders[renameIndex]?.name}
          onClose={() => setShowRenameModal(false)}
          onConfirm={handleRenameFolder}
        />
      )}
    </DriveLayout>
  ) : null;
};

export default Drivepage;
