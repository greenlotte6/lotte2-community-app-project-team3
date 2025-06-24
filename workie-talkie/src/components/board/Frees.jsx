export const Frees = ({ frees }) => {
  return (
    <div className="free">
      <h3>💬 자유게시판</h3>
      {frees.length === 0 ? (
        <p>게시물이 없습니다.</p>
      ) : (
        frees.map((free) => (
          <div key={free.ano} className="post-card">
            <div className="post-title">{free.title}</div>
            <div className="content-summary">{free.content}</div>
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
