import React, { useState } from "react";
import { LandingLayout } from "../../layouts/LandingLayout";

const termsData = {
  all: {
    title: "전체 동의",
    text: "모든 약관에 동의합니다.",
  },
  terms: {
    title: "서비스 이용 약관",
    text: "이용 약관 상세 내용입니다. 여기에 이용약관 전문을 입력하세요.",
  },
  privacy: {
    title: "개인정보 수집 및 이용 안내",
    text: "개인정보 수집 및 이용에 대한 안내입니다. 여기에 안내 전문을 입력하세요.",
  },
  marketing: {
    title: "광고성 정보 수신",
    text: "광고성 정보 수신에 대한 설명입니다. 수신 여부는 선택사항입니다.",
  },
};

export const Policies = () => {
  const [checkedItems, setCheckedItems] = useState({
    terms: false,
    privacy: false,
    marketing: false,
  });
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [modalType, setModalType] = useState(null);

  const handleAgree = () => {
    if (modalType === "all") {
      setCheckedItems({ terms: true, privacy: true, marketing: true });
      setIsAllChecked(true);
    } else {
      const updated = { ...checkedItems, [modalType]: true };
      setCheckedItems(updated);
      const allChecked = Object.values(updated).every(Boolean);
      setIsAllChecked(allChecked);
    }
    setModalType(null);
  };

  const handleCheckboxChange = (key) => {
    const updated = { ...checkedItems, [key]: !checkedItems[key] };
    setCheckedItems(updated);
    const allChecked = Object.values(updated).every(Boolean);
    setIsAllChecked(allChecked);
  };

  const handleAllCheckbox = () => {
    const newState = !isAllChecked;
    setIsAllChecked(newState);
    setCheckedItems({
      terms: newState,
      privacy: newState,
      marketing: newState,
    });
  };

  return (
    <LandingLayout>
      <div id="policies">
        <div className="container">
          <div className="step">1/2</div>
          <h2>약관 및 개인정보 수집, 이용 안내에 동의해주세요.</h2>
          <p className="description">
            네이버 클라우드 플랫폼 이용을 위해 약관 및 개인정보 수집 및 이용
            안내 동의가 필요합니다.
          </p>

          <div className="agreement">
            <label>
              <input
                type="checkbox"
                checked={isAllChecked}
                onChange={handleAllCheckbox}
              />
              전체 동의
            </label>
          </div>

          {["terms", "privacy", "marketing"].map((key) => (
            <div key={key} className="agreement">
              <label>
                <input
                  type="checkbox"
                  checked={checkedItems[key]}
                  onChange={() => handleCheckboxChange(key)}
                />
                [{key === "marketing" ? "선택" : "필수"}] {termsData[key].title}
              </label>
              <span
                onClick={() => setModalType(key)}
                style={{ cursor: "pointer" }}
              >
                보기
              </span>
            </div>
          ))}

          <div className="button-group">
            <a href="/index">
              <button className="prev">&lt; 이전</button>
            </a>
            <a href="/user/register">
              <button className="next">다음 &gt;</button>
            </a>
          </div>
        </div>

        {/* 모달 */}
        {modalType && (
          <div className="modal-overlay" onClick={() => setModalType(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>{termsData[modalType].title}</h3>
              <p>{termsData[modalType].text}</p>
              <button onClick={handleAgree}>동의</button>
              <button onClick={() => setModalType(null)}>닫기</button>
            </div>
          </div>
        )}
      </div>
    </LandingLayout>
  );
};
