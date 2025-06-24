import { useEffect, useState } from "react";

export const Frees = ({ frees, onClickHandler }) => {
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
    <div className="free">
      <h3>💬 자유게시판</h3>
      {frees.length === 0 ? (
        <p>게시물이 없습니다.</p>
      ) : (
        frees.map((free) => (
          <div
            key={free.ano}
            className="post-card"
            onClick={() => onClickHandler(free.ano)}
            style={{ cursor: "pointer" }}
          >
            <div className="post-title">{(free.category, free.title)}</div>
            <div className="content-summary">
              {free.content
                .replace(/<p>/g, "") // <p> 태그 제거
                .replace(/<\/p>/g, "") // </p> 태그 제거
                .replace(/<strong>/g, "") // </p> 태그 제거
                .replace(/<\/strong>/g, "") // </p> 태그 제거
                .substr(0, getContentLimit()) +
                (free.content.length > getContentLimit() ? "..." : "")}
            </div>
            <div className="post-meta">
              <span>{free.writer}</span>
              <span>{new Date(free.wDate).toLocaleDateString()}</span>
              <span>💬 {free.comments ? free.comments : 0}</span>
              <span>👀 {free.views ? free.views : 0}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
