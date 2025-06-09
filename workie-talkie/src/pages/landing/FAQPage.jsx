import React, { useState } from "react";
import { Header } from "../../components/landing/Header";
import { Footer } from "../../components/common/Footer";
//import "../../styles/landing/faq.scss";

const FAQPage = () => {
  // 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState("");

  // 검색어 변경 핸들러
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // FAQ 데이터
  const faqCategories = [
    {
      title: "일반",
      questions: [
        {
          question: "워키토키는 무엇인가요?",
          answer: "워키토키는 팀 협업과 소통을 위한 올인원 플랫폼입니다.",
        },
        {
          question: "무료 버전과 유료 버전의 차이점은?",
          answer:
            "무료 버전은 기본 기능을, 유료 버전은 고급 협업 도구를 제공합니다.",
        },
        {
          question: "몇 명까지 팀에 초대할 수 있나요?",
          answer:
            "플랜에 따라 다르며, PRO 플랜은 무제한 팀원 초대가 가능합니다.",
        },
      ],
    },
    {
      title: "계정 및 결제",
      questions: [
        {
          question: "계정은 어떻게 생성하나요?",
          answer:
            "회원가입 페이지에서 이메일과 비밀번호로 간단히 가입할 수 있습니다.",
        },
        {
          question: "결제 방법은 어떤 것이 있나요?",
          answer:
            "신용카드, 계좌이체, 페이팔 등 다양한 결제 방법을 지원합니다.",
        },
        {
          question: "플랜 변경은 언제든 가능한가요?",
          answer:
            "네, 언제든지 플랜을 업그레이드하거나 다운그레이드할 수 있습니다.",
        },
      ],
    },
    {
      title: "기술 지원",
      questions: [
        {
          question: "로그인에 문제가 있어요",
          answer: "비밀번호 재설정을 시도하거나 고객센터로 문의해주세요.",
        },
        {
          question: "데이터 백업은 어떻게 하나요?",
          answer:
            "설정 메뉴에서 자동 백업을 활성화하거나 수동으로 백업할 수 있습니다.",
        },
        {
          question: "모바일 앱이 있나요?",
          answer:
            "iOS와 Android 앱을 모두 제공하며, 앱스토어에서 다운로드 가능합니다.",
        },
      ],
    },
  ];

  // 검색 필터링 함수
  const getFilteredCategories = () => {
    if (!searchTerm.trim()) return faqCategories;

    return faqCategories
      .map((category) => ({
        ...category,
        questions: category.questions.filter(
          (item) =>
            item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter((category) => category.questions.length > 0);
  };

  // 고객센터 문의 버튼 클릭 핸들러
  const handleContactClick = () => {
    // 실제로는 고객센터 페이지로 이동하거나 모달을 띄울 수 있음
    alert("고객센터로 연결됩니다!");
  };

  const filteredCategories = getFilteredCategories();

  return (
    <div id="wrapper">
      <Header />
      <div className="empty-box" />

      <main>
        {/* FAQ 히어로 섹션 */}
        <section className="faq-section">
          <div className="faq-container">
            <div className="faq-content">
              {/* 왼쪽 텍스트 및 검색 영역 */}
              <div className="faq-text">
                <h1>무엇을 도와드릴까요?</h1>
                <div className="search-container">
                  <div className="search-box">
                    <svg
                      className="search-icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="11"
                        cy="11"
                        r="8"
                        stroke="#6b7280"
                        strokeWidth="2"
                      />
                      <path
                        d="m21 21-4.35-4.35"
                        stroke="#6b7280"
                        strokeWidth="2"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="질문이나 키워드를 검색해보세요..."
                      className="search-input"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
              </div>

              {/* 오른쪽 이미지 영역 */}
              <div className="faq-image">
                <img src="/images/main/faq2.jpg" alt="고객 지원" />
              </div>
            </div>
          </div>
        </section>

        {/* 자주 묻는 질문 섹션 */}
        <section className="questions-section">
          <div className="questions-container">
            <h2>자주 묻는 질문</h2>

            {/* 검색 결과가 없을 때 */}
            {searchTerm.trim() && filteredCategories.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#6b7280",
                }}
              >
                <p>'{searchTerm}'에 대한 검색 결과가 없습니다.</p>
                <p>다른 키워드로 검색해보세요.</p>
              </div>
            )}

            {/* 검색 결과 표시 */}
            {searchTerm.trim() && filteredCategories.length > 0 && (
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "40px",
                  color: "#6b7280",
                }}
              >
                <p>
                  '{searchTerm}'에 대한 검색 결과 (
                  {filteredCategories.reduce(
                    (total, cat) => total + cat.questions.length,
                    0
                  )}
                  개)
                </p>
              </div>
            )}

            <div className="questions-grid">
              {filteredCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="question-category">
                  <h3>{category.title}</h3>
                  <div className="question-list">
                    {category.questions.map((item, questionIndex) => (
                      <div key={questionIndex} className="question-item">
                        <h4>{item.question}</h4>
                        <p>{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 추가 도움말 섹션 */}
            <div className="help-footer">
              <h3>원하는 답변을 찾지 못하셨나요?</h3>
              <p>
                언제든지 우리 팀에 문의해주세요. 빠르게 도움을 드리겠습니다.
              </p>
              <button className="contact-btn" onClick={handleContactClick}>
                고객센터 문의하기
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export { FAQPage };
