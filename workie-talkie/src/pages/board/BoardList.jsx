import React, { useEffect, useState } from "react";
import { BoardLayout } from "../../layouts/BoardLayout";
import { useNavigate, useParams } from "react-router-dom";
import { getBoardList } from "../../api/boardAPI";

export const BoardList = () => {
  const { category } = useParams(); // 'notice', 'free', 'menu' 등
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await getBoardList(category);

        // 1. pinned가 true인 게시물과 아닌 게시물을 분리
        const pinnedPosts = data.filter((post) => post.pinned);
        const nonPinnedPosts = data.filter((post) => !post.pinned);

        // 2. 일반 게시물 (pinned가 false인 것들)을 wDate 최신순으로 정렬
        const sortedNonPinnedPosts = nonPinnedPosts.sort(
          (a, b) => new Date(b.wDate) - new Date(a.wDate)
        );

        // 3. pinned 게시물을 먼저 두고, 그 뒤에 정렬된 일반 게시물들을 합칩니다.
        const finalBoards = [...pinnedPosts, ...sortedNonPinnedPosts];

        setBoards(finalBoards); // 성공 시 상태에 저장
      } catch (err) {
        console.error("게시판 목록 불러오기 실패", err);
      }
    };

    fetchBoards();
  }, [category]); // category 바뀔 때마다 다시 호출

  // 게시글 클릭 시 상세 페이지로 이동하는 핸들러
  const handleRowClick = (ano) => {
    navigate(`/board/${ano}`); // category와 ano를 URL에 포함하여 이동
  };

  return (
    <BoardLayout>
      <main className="main-content" id="board-list-container">
        <article className="main-content">
          <div className="board">
            <h3>
              {category === "notice"
                ? "공지사항"
                : category === "free"
                ? "자유게시판"
                : category === "menu"
                ? "식단표"
                : "게시판"}
            </h3>
            <p>
              {category === "notice"
                ? "📢 회사 소식, 가장 먼저 확인하세요."
                : category === "free"
                ? "📣 누구나 이야기할 수 있는 열린 공간입니다."
                : category === "menu"
                ? "📅 주간 식단 안내입니다."
                : "💬 함께 나누는 이야기, 자유롭게 소통해요."}
            </p>
            <table>
              <thead>
                <tr>
                  <th>글번호</th>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>조회수</th>
                  <th>작성일</th>
                </tr>
              </thead>
              <tbody>
                {boards.map((post, idx) => (
                  <tr
                    key={post.id}
                    className={post.pinned ? "pinned-post" : ""}
                    onClick={() => handleRowClick(post.ano)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{idx + 1}</td>
                    <td>{post.title}</td>
                    <td>{post.writer}</td>
                    <td>0</td>
                    <td>{new Date(post.wDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="page">
              <a href="#">1</a>
              <a href="#">2</a>
              <a href="#">3</a>
            </div>
          </div>
        </article>
      </main>
    </BoardLayout>
  );
};
