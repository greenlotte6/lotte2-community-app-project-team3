import React, { useEffect, useState } from "react";
import { SettingLayout } from "../../layouts/SettingLayout";
import { useNavigate, useParams } from "react-router-dom";
import { useLoginStore } from "../../stores/useLoginStore";
import axios from "axios";
import { SETTING_PROFILE } from "../../api/http";

export const Profile = () => {
  const user = useLoginStore((state) => state.user);
  console.log("user in Profile:", user);

  const navigate = useNavigate();

  const [modifyUser, setModifyUser] = useState({
    id: "",
    pass: "",
    pass1: "",
    pass2: "",
    name: "",
    email: "",
    hp: "",
    employeeId: "",
    office: "",
    department: "",
    position: "",
    ssn: "",
  });

  //const [searchParams] = useSearchParams();
  const { id } = useParams();

  //const id = searchParams.get("id");
  console.log("id: " + id);

  //로그아웃 되면 로그인 창으로 이동
  useEffect(() => {
    if (!user) {
      navigate("/user/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    axios
      .get(`${SETTING_PROFILE}/${id}`)
      .then((response) => {
        console.log(response);

        //state 초기화
        setModifyUser((prev) => ({
          ...prev,
          ...response.data,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const submitHandler = (e) => {
    e.preventDefault();

    const { pass1, pass2, ...finalUser } = modifyUser;

    if (pass1 !== pass2) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (pass2.length < 8) {
      alert("비밀번호는 8자리 이상이어야 합니다.");
      return;
    }

    axios
      .put(SETTING_PROFILE, finalUser)
      .then((response) => {
        console.log(response.data);

        navigate(SETTING_PROFILE / { id });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changeHandler = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    // 비밀번호 입력 확인 처리
    if (name === "pass2") {
      setModifyUser((prev) => ({
        ...prev,
        pass2: value,
        pass: value === prev.pass1 ? value : "", // 일치 시만 pass에 저장
      }));
    } else if (name === "pass1") {
      setModifyUser((prev) => ({
        ...prev,
        pass1: value,
        pass: value === prev.pass2 ? value : "", // 일치 시만 pass에 저장
      }));
    } else {
      setModifyUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return user ? (
    <SettingLayout>
      <main className="main-content" id="profile-container">
        <article className="main-content">
          <div className="title">
            <h1>프로필 설정</h1>
          </div>
          <form onSubmit={submitHandler}>
            <div className="profile-setting">
              <div className="left">
                <div>
                  <img src="/images/profile1.png" alt="프로필이미지" />
                </div>
                <a href="#">프로필사진 변경</a>
              </div>
              <div className="right">
                <h4>이름</h4>
                <input
                  type="text"
                  name="name"
                  readOnly
                  value={modifyUser?.name}
                />

                <h4>이메일</h4>
                <input
                  type="text"
                  name="email"
                  value={modifyUser?.email}
                  onChange={changeHandler}
                />

                <h4>사내번호</h4>
                <input
                  type="text"
                  name="office"
                  value={modifyUser?.office}
                  onChange={changeHandler}
                />

                <h4>부서</h4>
                <input
                  type="text"
                  name="department"
                  readOnly
                  value={modifyUser?.department}
                />

                <h4>사번 / 직급</h4>
                <div className="input-row">
                  <input
                    type="text"
                    name="employeeId"
                    readOnly
                    value={modifyUser?.employeeId}
                  />
                  <input
                    type="text"
                    name="position"
                    readOnly
                    value={modifyUser?.position}
                  />
                </div>

                <h4>아이디</h4>
                <input type="text" name="id" readOnly value={modifyUser?.id} />

                <h4>생년월일</h4>
                <input
                  type="text"
                  name="ssn"
                  readOnly
                  value={
                    modifyUser?.ssn
                      ? `${modifyUser.ssn.substring(
                          0,
                          2
                        )}.${modifyUser.ssn.substring(
                          2,
                          4
                        )}.${modifyUser.ssn.substring(4, 6)}`
                      : ""
                  }
                />

                <h4>비밀번호</h4>
                <div className="input-row">
                  <input
                    type="password"
                    name="pass1"
                    value={modifyUser?.pass1}
                    onChange={changeHandler}
                    placeholder="새로운 비밀번호"
                  />
                  <input
                    type="password"
                    name="pass2"
                    value={modifyUser?.pass2}
                    onChange={changeHandler}
                    placeholder="비밀번호 확인"
                  />
                </div>
              </div>
            </div>

            <div className="btn">
              <button type="submit">S A V E</button>
            </div>
          </form>
        </article>
      </main>
    </SettingLayout>
  ) : null;
};
