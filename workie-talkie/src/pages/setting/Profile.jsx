import React from "react";
import { SettingLayout } from "../../layouts/SettingLayout";
import { Link } from "react-router-dom";

export const Profile = () => {
  return (
    <SettingLayout>
      <main class="main-content" id="profile-container">
        <article class="main-content">
          <div class="title">
            <h1>프로필 설정</h1>
          </div>
          <div class="profile-setting">
            <div class="left">
              <div>
                <img src="/images/profile1.png" alt="프로필이미지" />
              </div>
              <a href="#">프로필사진 변경</a>
            </div>
            <div class="right">
              <h4>이름</h4>
              <input type="text" name="name" readonly placeholder="김팀장" />

              <h4>이메일</h4>
              <input
                type="text"
                name="email"
                placeholder="kimleader@example.com"
              />

              <h4>사내번호</h4>
              <input type="text" name="office" placeholder="051-123-1234" />

              <h4>부서</h4>
              <input type="text" name="department" readonly placeholder="IT" />

              <h4>사번 / 직급</h4>
              <div class="input-row">
                <input
                  type="text"
                  name="employId"
                  readonly
                  placeholder="M1029"
                />
                <input
                  type="text"
                  name="position"
                  readonly
                  placeholder="대리"
                />
              </div>

              <h4>아이디</h4>
              <input type="text" name="id" readonly placeholder="kim0531" />

              <h4>비밀번호</h4>
              <div class="input-row">
                <input
                  type="password"
                  name="pass1"
                  placeholder="새로운 비밀번호"
                />
                <input
                  type="password"
                  name="pass2"
                  placeholder="비밀번호 확인"
                />
              </div>

              <h4>가입 날짜</h4>
              <input
                type="text"
                name="regDate"
                readonly
                placeholder="2025.05.31"
              />
            </div>
          </div>

          <div class="btn">
            <button>S A V E</button>
          </div>
        </article>
      </main>
    </SettingLayout>
  );
};
