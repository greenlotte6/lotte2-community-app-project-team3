import React, { useEffect, useRef, useState } from "react";

export const ShareModal = ({ onClose }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("전체 허용");
  const dropdownRef = useRef(null); // 드롭다운 요소를 참조할 ref 생성
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 드롭다운이 열려있고, 클릭된 요소가 드롭다운 내부에 포함되지 않는 경우
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // 전역 클릭 이벤트 리스너 등록

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // 컴포넌트 언마운트 시 리스너 제거
    };
  }, []); // isDropdownOpen이 변경될 때마다 효과

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (event) => {
    const clickedText = event.target.textContent; // 클릭된 li의 텍스트 가져오기
    setSelectedText(clickedText); // 버튼 텍스트 상태 업데이트
    setIsDropdownOpen(false); // 드롭다운 닫기

    // TODO: 실제 권한 변경 로직 여기에 추가 (예: 서버 요청, 부모 컴포넌트에 권한 전달)
    console.log("선택된 권한:", clickedText);
  };

  return (
    <>
      <h3>공유하기</h3>

      {/* 닫기 버튼 */}
      <button onClick={onClose} className="close-modal-btn">
        x
      </button>

      <div className="share-input-group">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input type="text" placeholder="이름으로 구분된 이메일 또는 그룹" />
      </div>

      <ul className="share-permission-list">
        <li className="share-permission-item">
          <div className="share-user-info">
            <span>user@gmail.com</span>
          </div>
          <div className="share-permission-dropdown">
            <button
              id="permissionDropdownBtn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedText} <i className="fa-solid fa-angle-down"></i>
            </button>
            {isDropdownOpen && (
              <ul className="share-permission-options" id="permissionOptions">
                <li onClick={handleOptionClick}>전체 허용</li>
                <li onClick={handleOptionClick}>편집 허용</li>
                <li onClick={handleOptionClick}>읽기 허용</li>
              </ul>
            )}
          </div>
        </li>
      </ul>
    </>
  );
};
