import React, { useEffect, useState } from "react";
import { BoardLayout } from "../../layouts/BoardLayout";
import { useParams } from "react-router-dom";
import { getBoardList } from "../../api/userAPI";

export const BoardList = () => {
  const { category } = useParams(); // 'notice', 'free', 'menu' 등
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await getBoardList(category);
        setBoards(data); // 성공 시 상태에 저장
      } catch (err) {
        console.error("게시판 목록 불러오기 실패", err);
      }
    };

    fetchBoards();
  }, [category]); // category 바뀔 때마다 다시 호출

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
                  <th>내용</th>
                  <th>조회수</th>
                  <th>작성일</th>
                </tr>
              </thead>
              <tbody>
                {boards.map((post, idx) => (
                  <tr key={post.id}>
                    <td>{boards.length - idx}</td>
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
