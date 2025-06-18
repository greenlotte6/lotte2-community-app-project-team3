import React, { useState, useEffect } from "react";
import { LandingLayout } from "../../layouts/LandingLayout";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { checkUserId, postUser } from "../../api/userAPI";

const initState = {
  id: "",
  pass: "",
  name: "",
  email: "",
  hp: "",
  ssn: "",
  role: "",
  position: "",
  office: "",
  department: "",
  rating: "",
  inviteCode: "",
};

export const General = () => {
  const [idChecked, setIdChecked] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [user, setUser] = useState({ ...initState });

  const [params] = useSearchParams();
  const inviteCode = params.get("invite");

  console.log("📌 초대코드:", inviteCode); // 👉 실제 값 확인

  const navigate = useNavigate();

  // 초대코드가 있을 경우 자동으로 role, inviteCode 설정
  useEffect(() => {
    if (inviteCode) {
      setUser((prev) => ({
        ...prev,
        role: "MEMBER",
        inviteCode: inviteCode,
      }));
    }
  }, [inviteCode]);

  const changeHandler = (e) => {
    e.preventDefault();
    setUser({ ...user, [e.target.name]: e.target.value });
    if (e.target.name === "id") setIdChecked(null);
  };

  const handleCheckId = async () => {
    if (!user.id) return alert("아이디를 입력하세요.");
    const exists = await checkUserId(user.id);
    setIdChecked(exists);
  };

  const handlePasswordChange = (e) => {
    const newPasswordValue = e.target.value;
    setPassword(newPasswordValue);
    setUser((prevUser) => ({ ...prevUser, pass: newPasswordValue }));
  };

  const handlePasswordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      alert("비밀번호가 최소 8자 이상이며, 확인란과 일치해야 합니다.");
      return;
    }

    if (
      !user.id ||
      !user.email ||
      !user.pass ||
      !user.name ||
      !user.hp ||
      !user.ssn
    ) {
      alert("모든 필수 정보를 입력해주세요.");
      return;
    }

    const fetchData = async () => {
      if (idChecked !== false) {
        alert("아이디 중복 확인을 완료해 주세요.");
        return;
      }

      try {
        const userWithRole = {
          ...user,
          role: inviteCode ? "MEMBER" : user.role,
          inviteCode: inviteCode || null,
        };

        await postUser(userWithRole);

        alert("회원가입 완료!");
        navigate("/user/login");
      } catch (err) {
        alert("입력하신 정보를 다시 한 번 확인해주세요.");
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
    password.length >= 8 &&
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
              <div className="checkedStatus">
                {idChecked !== null && (
                  <p
                    className="comment"
                    style={{ color: idChecked ? "red" : "green" }}
                  >
                    {idChecked
                      ? "이미 사용 중인 아이디입니다."
                      : "사용 가능한 아이디입니다."}
                  </p>
                )}
                <button
                  type="button"
                  className="checkBtn"
                  onClick={handleCheckId}
                >
                  중복확인
                </button>
              </div>
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
                id="password"
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

            <label>주민번호</label>
            <div className="input-group">
              <input
                type="text"
                id="ssn"
                name="ssn"
                value={user.ssn}
                onChange={changeHandler}
                placeholder="주민번호 입력"
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

            <label>이름</label>
            <div className="input-group">
              <input
                type="text"
                id="name"
                name="name"
                value={user.name}
                onChange={changeHandler}
                placeholder="이름 입력"
              />
            </div>

            <label>부서</label>
            <div className="input-group">
              <select
                id="department"
                name="department"
                value={user.department}
                onChange={changeHandler}
                className="form-select" // 필요하다면 CSS 클래스 추가
              >
                {/* 기본 옵션: 선택해주세요 */}
                <option value="">부서 선택</option>
                {/* 부서 목록 */}
                <option value="인사부">인사부</option>
                <option value="회계부">회계부</option>
                <option value="총무부">총무부</option>
                <option value="기획부">기획부</option>
                <option value="영업부">영업부</option>
                <option value="마케팅부">마케팅부</option>
                <option value="IT">IT</option>
              </select>
            </div>

            <label>직급</label>
            <div className="input-group">
              <select
                id="position"
                name="position"
                value={user.position}
                onChange={changeHandler}
                className="form-select" // 필요하다면 CSS 클래스 추가
              >
                {/* 기본 옵션: 선택해주세요 */}
                <option value="">직급 선택</option>
                {/* 위에서 제안된 직급 목록 */}
                <option value="사원">사원</option>
                <option value="주임">주임</option>
                <option value="대리">대리</option>
                <option value="과장">과장</option>
                <option value="차장">차장</option>
                <option value="부장">부장</option>
                <option value="이사">이사</option>
                <option value="상무">상무</option>
                <option value="전무">전무</option>
              </select>
            </div>

            <label>사무실번호</label>
            <div className="input-group">
              <input
                type="text"
                id="office"
                name="office"
                value={user.office}
                onChange={changeHandler}
                placeholder="사무실 개인 번호"
              />
            </div>

            <div className="btns">
              <Link to="/index">
                <button className="btn-prev">이전</button>
              </Link>
              <button
                className="btn-next"
                type="submit"
                disabled={!isPasswordValid}
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
