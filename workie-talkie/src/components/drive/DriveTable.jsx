import React, { useState, useRef } from "react";
import { ContextMenu } from "./ContextMenu"; // 우클릭 메뉴 컴포넌트

export const DriveTable = ({
  activeTab,
  folders,
  trash,
  selectedIndexes,
  setSelectedIndexes,
  onRequestRename,
  onRequestRestore,
  onRequestDelete,
}) => {
  const dropRef = useRef(null);
  const isTrash = activeTab === "🗑️ 휴지통";
  const data = Array.isArray(isTrash ? trash : folders)
    ? isTrash
      ? trash
      : folders
    : [];

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    index: null,
  });

  const handleContextMenu = (e, index) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      index,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  const handleCheckboxChange = (index, checked) => {
    setSelectedIndexes((prev) =>
      checked ? [...prev, index] : prev.filter((i) => i !== index)
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIndexes(data.map((_, i) => i));
    } else {
      setSelectedIndexes([]);
    }
  };

  return (
    <section className="tab-content active">
      {!isTrash && (
        <div id="drop-zone" className="drop-zone" ref={dropRef}>
          <p>여기로 파일을 끌어다 놓으세요</p>
          <input type="file" id="fileElem" multiple hidden />
          <label htmlFor="fileElem" className="upload-label">
            또는 클릭하여 파일 선택
          </label>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={
                  selectedIndexes.length === data.length && data.length > 0
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </th>
            {!isTrash && <th>종류</th>}
            <th>이름</th>
            {!isTrash && <th>크기</th>}
            <th>수정한 날짜</th>
            {!isTrash && <th>수정한 사람</th>}
            <th>생성한 날짜</th>
            {isTrash && <th>복원</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.dno || index}
              onContextMenu={(e) => handleContextMenu(e, index)}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedIndexes.includes(index)}
                  onChange={(e) =>
                    handleCheckboxChange(index, e.target.checked)
                  }
                />
              </td>
              {!isTrash && (
                <td>
                  <i
                    className={
                      item.type === "FILE" ? "fas fa-file" : "fas fa-folder"
                    }
                  />
                </td>
              )}
              <td>{item.name}</td>
              {!isTrash && <td>{item.size || "-"}</td>}
              <td>
                {item.modifiedAt
                  ? new Date(item.modifiedAt).toLocaleString()
                  : "-"}
              </td>
              {!isTrash && <td>-</td>}
              <td>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleString()
                  : "-"}
              </td>
              {isTrash && (
                <td>
                  <button onClick={() => onRequestRestore(index)}>복원</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <ContextMenu
        visible={contextMenu.visible}
        position={{ x: contextMenu.x, y: contextMenu.y }}
        onClose={handleCloseContextMenu}
        onDelete={() => {
          handleCloseContextMenu();
          if (onRequestDelete) onRequestDelete([contextMenu.index]);
        }}
        onRename={() => {
          handleCloseContextMenu();
          onRequestRename(contextMenu.index);
        }}
        onDownload={() => {
          handleCloseContextMenu();
          alert("📥 내려받기 기능은 추후 구현됩니다.");
        }}
      />
    </section>
  );
};
