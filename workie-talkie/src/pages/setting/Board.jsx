import React from "react";
import { SettingLayout } from "../../layouts/SettingLayout";
import { Link } from "react-router-dom";

export const Board = () => {
  return (
    <SettingLayout>
      <main class="main-content" id="board-container">
        <article class="main-content">
          <div class="title">
            <h1>게시판 설정</h1>
          </div>
          <div class="board-setting">
            <div class="board">
              <div class="head">
                <div>
                  <p>
                    게시판을 추가하거나 멤버 권한, 타입을 설정할 수 있습니다.
                  </p>
                  <p>
                    카테고리를 추가하거나 게시판 순서를 변경하려면 Admin 으로
                    접속 해주세요.
                  </p>
                </div>
                <a href="/admin/addBoard.html">
                  <button onclick="">ADD</button>
                </a>
              </div>
              <div class="body">
                <table>
                  <thead>
                    <tr>
                      <th>게시판명</th>
                      <th>작성권한</th>
                      <th>마스터</th>
                      <th>타입</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <a href="/admin/modifyBoard.html">공지사항</a>
                      </td>
                      <td>관리자</td>
                      <td>kim0531</td>
                      <td>게시판</td>
                    </tr>
                    <tr>
                      <td>자유게시판</td>
                      <td>제한없음</td>
                      <td>kim0531</td>
                      <td>게시판</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </article>
      </main>
    </SettingLayout>
  );
};
