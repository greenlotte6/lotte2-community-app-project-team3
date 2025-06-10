import React, { useEffect, useState } from "react";
import { SettingLayout } from "../../layouts/SettingLayout";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useLoginStore } from "../../stores/useLoginStore";
import axios from "axios";

export const Profile = () => {
  const user = useLoginStore((state) => state.user);
  console.log("user in Profile:", user);

  const navigate = useNavigate();

  const [modifyUser, setModifyUser] = useState({
    id: "",
    pass: "",
    name: "",
    email: "",
    hp: "",
    ssn: "",
    office: "",
    department: "",
  });

  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");
  console.log("id: " + id);

  useEffect(() => {
    if (!user) {
      navigate("/user/login");
    }
  }, [user]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/setting/profile/${id}`)
      .then((response) => {
        console.log(response);

        //state 초기화
        setModifyUser(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return user ? (
    <SettingLayout>
      <main className="main-content" id="profile-container">
        <article className="main-content">
          <div className="title">
            <h1>프로필 설정</h1>
          </div>
          <div className="profile-setting">
            <div className="left">
              <div>
                <img src="/images/profile1.png" alt="프로필이미지" />
              </div>
              <a href="#">프로필사진 변경</a>
            </div>
            <div className="right">
              <h4>이름</h4>
              <input type="text" name="name" readOnly value={user?.name} />

              <h4>이메일</h4>
              <input
                type="text"
                name="email"
                value={user?.email}
                onChange={null}
              />

              <h4>사내번호</h4>
              <input
                type="text"
                name="office"
                value={user?.office}
                onChange={null}
              />

              <h4>부서</h4>
              <input
                type="text"
                name="department"
                readOnly
                value={user?.department}
              />

              <h4>사번 / 직급</h4>
              <div className="input-row">
                <input
                  type="text"
                  name="employId"
                  readOnly
                  value={user?.position}
                />
                <input
                  type="text"
                  name="position"
                  readOnly
                  value={user?.position}
                />
              </div>

              <h4>아이디</h4>
              <input type="text" name="id" readOnly value={user?.id} />

              <h4>비밀번호</h4>
              <div className="input-row">
                <input
                  type="password"
                  name="pass1"
                  placeholder="새로운 비밀번호"
                />
                <input
                  type="password"
                  name="pass2"
                  onChange={null}
                  placeholder="비밀번호 확인"
                />
              </div>

              <h4>가입 날짜</h4>
              <input
                type="text"
                name="regDate"
                readOnly
                value={user?.regDate}
              />
            </div>
          </div>

          <div className="btn">
            <button>S A V E</button>
          </div>
        </article>
      </main>
    </SettingLayout>
  ) : null;
};
