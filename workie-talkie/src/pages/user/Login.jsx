import React, { useState } from "react";
import { LandingLayout } from "../../layouts/LandingLayout";
import { data, Link, useNavigate } from "react-router-dom";
import { useLoginStore } from "../../stores/useLoginStore";
import { postUserLogin } from "../../api/userAPI";

const initState = {
  id: "",
  pass: "",
};

export const Login = () => {
  const [user, setUser] = useState({ ...initState });

  const navigate = useNavigate();
  const login = useLoginStore((state) => state.login);

  const changeHandler = (e) => {
    e.preventDefault();

    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const fetchData = async () => {
      try {
        const data = await postUserLogin(user);

        // 🔽 data가 없으면 처리 중단
        if (!data || !data.username) {
          throw new Error("로그인 응답이 올바르지 않습니다");
        }

        if (data.token) {
          //localStorage.setItem("token", data.token);
          localStorage.setItem("accessToken", data.token); // 🔥 핵심 수정 포인트
          console.log("✅ accessToken 저장됨:", data.token);
        }

        // ✅ 필요한 필드만 골라 명시적으로 상태에 저장
        const userData = {
          username: data.username,
          name: data.name,
          email: data.email,
          role: data.role, // ✅ 여기!
          token: data.token,
          position: data.position,
          employeeId: data.employeeId,
          department: data.department,
        };

        login(userData);
        navigate("/dashboard/main");
      } catch (err) {
        alert("아이디/비밀번호를 확인해주세요");
        console.error(err);
      }
    };

    fetchData();
  };

  return (
    <LandingLayout>
      <div id="login-container">
        <form onSubmit={submitHandler}>
          <div className="login">
            <h1>로그인</h1>
            <p>진행 하시려면 로그인을 해주세요.</p>

            <input
              type="id"
              name="id"
              value={user.id}
              onChange={changeHandler}
              placeholder="ID"
            />
            <input
              type="password"
              name="pass"
              value={user.pass}
              onChange={changeHandler}
              placeholder="Password"
            />

            <div className="remember-forgot">
              <label>
                <input type="checkbox" /> 로그인 상태 유지
              </label>
              <Link to="/user/findId">아이디 찾기</Link>
              <Link to="/user/findPw">비밀번호 찾기</Link>
            </div>

            <button type="submit" value="로그인" className="login-btn">
              로그인
            </button>

            <div className="social-login">
              <div className="social-buttons">
                <button>G&nbsp; Google</button>
                <button> Apple</button>
                <button> Twitter</button>
              </div>
            </div>

            <div className="signup-link">
              계정이 없으신가요? <Link to="/user/policies">회원가입</Link>
            </div>
          </div>
        </form>
      </div>
    </LandingLayout>
  );
};
