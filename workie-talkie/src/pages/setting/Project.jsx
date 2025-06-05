import React from "react";
import { SettingLayout } from "../../layouts/SettingLayout";
import { Link } from "react-router-dom";

export const Project = () => {
  return (
    <SettingLayout>
      <main class="main-content" id="project-container">
        <article class="main-content">
          <div class="title">
            <h1>프로젝트 설정</h1>
          </div>
          <div class="board-setting">
            <div class="board">
              <div class="head">
                <p>
                  프로젝트를 추가하거나 멤버 권한, 타입을 설정할 수 있습니다.
                </p>
                <a href="/admin/addProject.html">
                  <button onclick="">ADD</button>
                </a>
              </div>
              <div class="body">
                <table>
                  <thead>
                    <tr>
                      <th>프로젝트명</th>
                      <th>담당자</th>
                      <th>공유멤버</th>
                      <th>날짜</th>
                      <th>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <a href="/admin/modifyProject.html">프로젝트1</a>
                      </td>
                      <td>김팀장</td>
                      <td>5</td>
                      <td>2025.06.04 ~ 2025.06.30</td>
                      <td>종료</td>
                    </tr>
                    <tr>
                      <td>프로젝트2</td>
                      <td>김팀장</td>
                      <td>3</td>
                      <td>2025.06.04 ~ 2025.06.30</td>
                      <td>진행중</td>
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
