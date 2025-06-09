import React from "react";
import { BoardLayout } from "../../layouts/BoardLayout";

export const BoardList = () => {
  return (
    <BoardLayout>
      <main className="main-content" id="board-list-container">
        <article className="main-content">
          <div className="board">
            <h3>공지사항</h3>
            <p>📢 회사 소식, 가장 먼저 확인하세요.</p>
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
                <tr>
                  <td>1</td>
                  <td>공지사항입니다1</td>
                  <td>내용입니다1 (10)</td>
                  <td>50</td>
                  <td>2025.06.03</td>
                </tr>
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
