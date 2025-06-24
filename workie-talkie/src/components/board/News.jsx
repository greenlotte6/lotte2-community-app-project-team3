import { useEffect, useState } from "react";

export const News = ({ news, onClickHandler }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 글자 수 제한을 설정하는 로직 (창 크기에 따라 다르게 설정)
  const getContentLimit = () => {
    if (windowWidth > 1200) {
      return 40; // 큰 화면에서는 100글자까지
    } else if (windowWidth > 800) {
      return 15; // 중간 화면에서는 75글자까지
    } else {
      return 10; // 작은 화면에서는 50글자까지
    }
  };

  return (
    <div className="new">
      <h3>🆕 NEW</h3>
      {news.length === 0 ? (
        <p>게시물이 없습니다.</p>
      ) : (
        news.map((recent) => (
          <div
            key={recent.ano}
            className="post-card"
            onClick={() => onClickHandler(recent.category, recent.ano)}
            style={{ cursor: "pointer" }}
          >
            <div className="post-title">
              [
              {recent.category === "notice"
                ? "공지사항"
                : recent.category === "free"
                ? "자유게시판"
                : recent.category === "menu"
                ? "식단표"
                : "알 수 없는 카테고리"}
              ] {recent.title}
            </div>
            <div className="content-summary">
              {recent.content
                .replace(/<p>/g, "") // <p> 태그 제거
                .replace(/<\/p>/g, "") // </p> 태그 제거
                .replace(/<strong>/g, "") // </p> 태그 제거
                .replace(/<\/strong>/g, "") // </p> 태그 제거
                .substr(0, getContentLimit()) +
                (recent.content.length > getContentLimit() ? "..." : "")}
            </div>
            <div className="post-meta">
              <span>{recent.writer}</span>
              <span>{new Date(recent.wDate).toLocaleDateString()}</span>
              <span>💬 {recent.comments ? recent.comment : 0}</span>
              <span>👀 {recent.views ? recent.views : 0}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
