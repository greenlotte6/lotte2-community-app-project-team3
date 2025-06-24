export const News = ({ news }) => {
  return (
    <div className="new">
      <h3>🆕 NEW</h3>
      {news.length === 0 ? (
        <p>게시물이 없습니다.</p>
      ) : (
        news.map((recent) => (
          <div key={recent.ano} className="post-card">
            <div className="post-title">
              [{recent.category}] {recent.title}
            </div>
            <div className="content-summary">{recent.content}</div>
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
