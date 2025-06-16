import React, { useEffect, useState } from "react";
import { DriveLayout } from "../../layouts/DriveLayout";
import { DriveHeader } from "../../components/drive/DriveHeader";
import { DriveTable } from "../../components/drive/DriveTable";
import { FolderModal } from "../../components/drive/FolderModal";
import { RenameModal } from "../../components/drive/RenameModal";
import axios from "axios";

const Drivepage = () => {
  const [activeTab, setActiveTab] = useState("⭐ 내 드라이브");
  const [folders, setFolders] = useState([]);
  const [trash, setTrash] = useState([]);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameIndex, setRenameIndex] = useState(null);

  // ✅ 폴더 목록 불러오기
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get("/drive", {
          params: { parentId: null },
          withCredentials: true,
        });
        setFolders(response.data);
      } catch (error) {
        console.error("폴더 조회 실패:", error);
      }
    };

    if (activeTab === "⭐ 내 드라이브") {
      fetchFolders();
    }
  }, [activeTab]);

  // ✅ 폴더 생성
  const handleAddFolder = async (name) => {
    try {
      const response = await axios.post("/drive/folder", null, {
        params: {
          name,
          parentId: null,
        },
        withCredentials: true,
      });

      const newFolderId = response.data;
      const now = new Date().toISOString();

      const newFolder = {
        dno: newFolderId,
        name,
        createdAt: now,
        modifiedAt: now,
        type: "FOLDER",
      };

      setFolders((prev) => [...prev, newFolder]);
      setShowFolderModal(false);
    } catch (error) {
      console.error("폴더 생성 실패:", error);
    }
  };

  // ✅ 이름 변경 (임시 - 추후 API 연동 가능)
  const handleRenameFolder = (newName) => {
    const updated = [...folders];
    updated[renameIndex].name = newName;
    updated[renameIndex].modifiedAt = new Date().toISOString();
    setFolders(updated);
    setRenameIndex(null);
    setShowRenameModal(false);
  };

  // ✅ 삭제 (추후 API 연동 필요)
  const handleDelete = (indexes) => {
    const toTrash = indexes.map((i) => folders[i]);
    setTrash([...trash, ...toTrash]);
    setFolders(folders.filter((_, i) => !indexes.includes(i)));
    setSelectedIndexes([]);
  };

  // ✅ 복원 (추후 API 연동 필요)
  const handleRestore = (indexes) => {
    const toRestore = indexes.map((i) => trash[i]);
    setFolders([...folders, ...toRestore]);
    setTrash(trash.filter((_, i) => !indexes.includes(i)));
    setSelectedIndexes([]);
  };

  return (
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
  );
};

export default Drivepage;
