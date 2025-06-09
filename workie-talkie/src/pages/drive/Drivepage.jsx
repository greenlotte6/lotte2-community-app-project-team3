import React, { useEffect, useState } from "react";
import { DriveLayout } from "../../layouts/DriveLayout";
import { DriveHeader } from "../../components/drive/DriveHeader";
import { DriveTable } from "../../components/drive/DriveTable";
import { FolderModal } from "../../components/drive/FolderModal";
import { RenameModal } from "../../components/drive/RenameModal";

const Drivepage = () => {
  const [activeTab, setActiveTab] = useState("⭐ 내 드라이브");
  const [folders, setFolders] = useState(() => {
    return JSON.parse(localStorage.getItem("folders")) || [];
  });
  const [trash, setTrash] = useState(() => {
    return JSON.parse(localStorage.getItem("trash")) || [];
  });
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameIndex, setRenameIndex] = useState(null);

  // 저장
  useEffect(() => {
    localStorage.setItem("folders", JSON.stringify(folders));
    localStorage.setItem("trash", JSON.stringify(trash));
  }, [folders, trash]);

  // 새 폴더 생성
  const handleAddFolder = (name) => {
    const now = new Date().toLocaleString();
    setFolders([...folders, { name, createdAt: now, modifiedAt: now }]);
    setShowFolderModal(false);
  };

  // 이름 변경
  const handleRenameFolder = (newName) => {
    const updated = [...folders];
    updated[renameIndex].name = newName;
    updated[renameIndex].modifiedAt = new Date().toLocaleString();
    setFolders(updated);
    setRenameIndex(null);
    setShowRenameModal(false);
  };

  // 삭제
  const handleDelete = (indexes) => {
    if (activeTab === "🗑️ 휴지통") {
      setTrash(trash.filter((_, i) => !indexes.includes(i)));
    } else {
      const toTrash = indexes.map((i) => folders[i]);
      setTrash([...trash, ...toTrash]);
      setFolders(folders.filter((_, i) => !indexes.includes(i)));
    }
    setSelectedIndexes([]);
  };

  // 복원
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
