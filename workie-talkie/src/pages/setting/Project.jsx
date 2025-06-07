import React, { useState } from "react";
import { SettingLayout } from "../../layouts/SettingLayout";
import { Link } from "react-router-dom";
import { AddProjectModal } from "../../components/setting/AddProjectModal";
import { ModifyProjectModal } from "../../components/setting/ModifyProjectModal";

export const Project = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  return (
    <SettingLayout>
      <main className="main-content" id="project-container">
        <article className="main-content">
          <div className="title">
            <h1>프로젝트 설정</h1>
          </div>
          <div className="board-setting">
            <div className="board">
              <div className="head">
                <p>
                  프로젝트를 추가하거나 멤버 권한, 타입을 설정할 수 있습니다.
                </p>
                <button onClick={() => setIsModalOpen(true)}>ADD</button>
              </div>
              <div className="body">
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
                        <p onClick={() => setIsModifyOpen(true)}>프로젝트1</p>
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
        {isModalOpen && (
          <AddProjectModal onClose={() => setIsModalOpen(false)} />
        )}
        {isModifyOpen && (
          <ModifyProjectModal onClose={() => setIsModifyOpen(false)} />
        )}
      </main>
    </SettingLayout>
  );
};
