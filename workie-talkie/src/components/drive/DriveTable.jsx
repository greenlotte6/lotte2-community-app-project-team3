import React, { useState, useRef } from "react";

export const DriveTable = ({ activeTab, folders, trash, onRequestRename }) => {
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const dropRef = useRef(null);

  const isTrash = activeTab === "🗑️ 휴지통";
  const data = isTrash ? trash : folders;

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
    <section className="tab-content active" id="drive-container">
      {/* 드래그 앤 드롭 영역 (선택 사항) */}
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
            <tr key={index}>
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
                  <i className="fas fa-folder" />
                </td>
              )}
              <td>{item.name}</td>
              {!isTrash && <td>{item.size || "-"}</td>}
              <td>{item.modifiedAt}</td>
              {!isTrash && <td>-</td>}
              <td>{item.createdAt}</td>
              {isTrash && (
                <td>
                  <button onClick={() => onRequestRename(index)}>복원</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
