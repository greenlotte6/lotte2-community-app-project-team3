import React from "react";
import { SettingLayout } from "../../layouts/SettingLayout";

export const Member = () => {
  return (
    <SettingLayout>
      <main className="main-content" id="member-container">
        <article className="main-content">
          <div className="title">
            <h1>회원관리</h1>
          </div>
          <div className="member-setting">
            <div className="member">
              <div className="head">
                <div>
                  <p>회원 목록, 회원 초대 및 회원 수정을 할 수 있습니다.</p>
                </div>
                <button>INVITE</button>
              </div>

              <div className="body">
                <table>
                  <thead>
                    <tr>
                      <th>아이디</th>
                      <th>이름</th>
                      <th>주민번호</th>
                      <th>휴대폰</th>
                      <th>사무실</th>
                      <th>직급</th>
                      <th>권한</th>
                      <th>가입날짜</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <p>kim0531</p>
                      </td>
                      <td>김팀장</td>
                      <td>123456-1234567</td>
                      <td>010-1234-1234</td>
                      <td>051-123-1234</td>
                      <td>팀장</td>
                      <td>ADMIN</td>
                      <td>2025.06.03</td>
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
