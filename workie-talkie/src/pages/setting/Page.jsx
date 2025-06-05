import React, { useState } from "react";
import { SettingLayout } from "../../layouts/SettingLayout";
import { Link } from "react-router-dom";
import { AddPageModal } from "../../components/setting/AddPageModal";

export const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <SettingLayout>
      <main className="main-content" id="page-container">
        <article className="main-content">
          <div className="title">
            <h1>페이지 설정</h1>
          </div>
          <div className="page-setting">
            <div className="page">
              <div className="head">
                <p>
                  페이지를 추가하거나 멤버 권한, 공개여부를 설정할 수 있습니다.
                </p>
                <button onClick={() => setIsModalOpen(true)}>ADD</button>
              </div>

              <div className="body">
                <table>
                  <thead>
                    <tr>
                      <th>페이지명</th>
                      <th>작성권한</th>
                      <th>마스터</th>
                      <th>작성날짜</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="title">
                        <Link to="/setting/modifyPage">page1</Link>
                      </td>
                      <td>허용멤버만</td>
                      <td>kim0531</td>
                      <td>2025.06.03</td>
                    </tr>
                    <tr>
                      <td className="title">page2</td>
                      <td>제한없음</td>
                      <td>kim0531</td>
                      <td>2025.06.03</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </article>
        {isModalOpen && <AddPageModal onClose={() => setIsModalOpen(false)} />}
      </main>
    </SettingLayout>
  );
};
