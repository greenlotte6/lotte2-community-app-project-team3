export const Notices = ({ notices, importances }) => {
  // 1. importances 배열 자체를 wDate 최신순으로 정렬 (고정된 공지사항 내에서의 순서)
  const sortedImportances = [...importances].sort(
    (a, b) => new Date(b.wDate) - new Date(a.wDate)
  );

  // 2. notices 배열에서 importances에 이미 있는 게시물을 제외합니다.
  const filteredNotices = notices.filter(
    (notice) => !importances.some((imp) => imp.ano === notice.ano)
  );

  // 3. 필터링된 notices를 wDate 최신순으로 정렬합니다.
  const sortedNormalNotices = [...filteredNotices].sort(
    (a, b) => new Date(b.wDate) - new Date(a.wDate)
  );

  // 4. 정렬된 importances를 먼저 두고, 그 뒤에 정렬된 일반 공지사항을 합칩니다.
  const finalNoticesList = [...sortedImportances, ...sortedNormalNotices];

  return (
    <div className="notices">
      <h3>📢 공지사항</h3>
      <table>
        <thead>
          <tr>
            <th>글번호</th>
            <th>제목</th>
            <th>내용</th>
            <th>댓글수</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {finalNoticesList.length === 0 ? (
            <tr>
              <td colSpan="5">공지사항이 없습니다.</td>
            </tr>
          ) : (
            finalNoticesList.map((notice, index) => {
              const isImportance = importances.some(
                (imp) => imp.ano === notice.ano
              );
              return (
                <tr
                  key={notice.ano}
                  className={isImportance ? "importance" : ""}
                >
                  <td>{index + 1}</td>
                  <td>{notice.title}</td>
                  <td>{notice.content}</td>
                  <td>{notice.comments ? notice.comments : 0}</td>
                  <td>{new Date(notice.wDate).toLocaleDateString()}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
