import React, { useState } from "react";
import { LandingLayout } from "../../layouts/LandingLayout";
import { Link, useNavigate } from "react-router-dom";
import { postUser } from "../../api/userAPI";

const initState = {
  id: "",
  pass: "",
  name: "",
  email: "",
  hp: "",
  companyName: "",
  tax: "",
  ssn: "",
  zip: "",
  addr1: "",
  addr2: "",

  //사업자 회원가입
  role: "ADMIN",
  position: "CEO",
  office: "",
};

export const Register = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [user, setUser] = useState({ ...initState });
  const navigate = useNavigate(); // useNavigate 훅 사용

  const changeHandler = (e) => {
    e.preventDefault();

    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // 비밀번호 입력 필드 변경 핸들러
  const handlePasswordChange = (e) => {
    const newPasswordValue = e.target.value;
    setPassword(newPasswordValue); // `password` 상태 업데이트
    setUser((prevUser) => ({ ...prevUser, pass: newPasswordValue })); // `user.pass`도 업데이트
  };

  // 비밀번호 확인 입력 필드 변경 핸들러
  const handlePasswordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value); // `passwordConfirm` 상태만 업데이트
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(user);

    // 폼 제출 시 최종 유효성 검사
    if (!isPasswordValid) {
      alert(
        "비밀번호가 최소 8자 이상이어야 하며, 비밀번호 확인과 일치해야 합니다."
      );
      return;
    }

    // 모든 필수 필드 검사 (간단한 예시)
    if (
      !user.id ||
      !user.email ||
      !user.pass ||
      !user.name ||
      !user.hp ||
      !user.companyName ||
      !user.tax ||
      !user.ssn
    ) {
      alert("모든 필수 정보를 입력해주세요.");
      return;
    }

    const fetchData = async () => {
      try {
        const data = await postUser(user);

        alert("회원가입 완료!");
        navigate("/user/login");
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  };

  const togglePassword = (type) => {
    if (type === "password") setShowPassword((prev) => !prev);
    if (type === "passwordConfirm") setShowPasswordConfirm((prev) => !prev);
  };

  const isPasswordValid =
    password.length >= 8 && // 최소 8글자 이상
    passwordConfirm.length >= 8 &&
    password === passwordConfirm;

  return (
    <LandingLayout>
      <div id="register">
        <form onSubmit={submitHandler}>
          <div className="container">
            <h2>로그인 정보를 입력해주세요.</h2>
            <p className="subtext">
              입력하신 정보로 회원님의 계정이 생성됩니다.
            </p>

            <label>아이디</label>
            <div className="input-group">
              <input
                type="text"
                id="id"
                name="id"
                value={user.id}
                onChange={changeHandler}
                placeholder="아이디 입력"
              />
            </div>

            <label>이메일</label>
            <div className="input-group">
              <input
                type="text"
                id="email"
                name="email"
                value={user.email}
                onChange={changeHandler}
                placeholder="이메일 입력"
              />
              <button className="verify-btn">이메일 인증</button>
            </div>

            <label>비밀번호</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password" // id 추가
                value={password}
                onChange={handlePasswordChange}
                placeholder="비밀번호를 입력해 주세요."
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={() => togglePassword("password")}
              ></button>
            </div>

            <label>비밀번호 확인</label>
            <div className="input-group">
              <input
                type={showPasswordConfirm ? "text" : "password"}
                id="passwordConfirm"
                value={passwordConfirm}
                name="pass"
                onChange={handlePasswordConfirmChange}
                placeholder="비밀번호를 다시 입력해 주세요."
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={() => togglePassword("passwordConfirm")}
              ></button>
            </div>

            <label>회사명</label>
            <div className="input-group">
              <input
                type="text"
                id="company"
                name="companyName"
                value={user.companyName}
                onChange={changeHandler}
                placeholder="회사 입력"
              />
            </div>

            <label>대표자명</label>
            <div className="input-group">
              <input
                type="text"
                id="name"
                name="name"
                value={user.name}
                onChange={changeHandler}
                placeholder="대표자명(또는 성함) 입력"
              />
            </div>

            <label>사업자등록번호</label>
            <div className="input-group">
              <input
                type="text"
                id="tax"
                name="tax"
                value={user.tax}
                onChange={changeHandler}
                placeholder="사업자 등록 번호 입력"
              />
            </div>

            <label>주민번호</label>
            <div className="input-group">
              <input
                type="text"
                id="ssn"
                name="ssn"
                value={user.ssn}
                onChange={changeHandler}
                placeholder="사업자 등록 번호 입력"
              />
            </div>

            <label>핸드폰 번호</label>
            <div className="input-group">
              <input
                type="text"
                id="hp"
                name="hp"
                value={user.hp}
                onChange={changeHandler}
                placeholder="핸드폰번호 입력"
              />
            </div>

            {/* 주소 관련 필드 추가 (필요시) */}
            {/* <label htmlFor="zip">우편번호</label>
            <div className="input-group">
              <input type="text" id="zip" name="zip" value={user.zip} onChange={changeHandler} placeholder="우편번호" />
            </div>
            <label htmlFor="addr1">주소</label>
            <div className="input-group">
              <input type="text" id="addr1" name="addr1" value={user.addr1} onChange={changeHandler} placeholder="기본 주소" />
            </div>
            <label htmlFor="addr2">상세 주소</label>
            <div className="input-group">
              <input type="text" id="addr2" name="addr2" value={user.addr2} onChange={changeHandler} placeholder="상세 주소" />
            </div> */}

            <div className="btns">
              <Link to="/index">
                <button className="btn-prev">이전</button>
              </Link>
              <button
                className="btn-next"
                type="submit"
                disabled={!isPasswordValid} // 비밀번호 유효성 검사 통과해야 활성화
              >
                다음
              </button>
            </div>
          </div>
        </form>
      </div>
    </LandingLayout>
  );
};
