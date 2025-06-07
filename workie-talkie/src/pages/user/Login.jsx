import React, { useState } from "react";
import { LandingLayout } from "../../layouts/LandingLayout";
import { Link, useNavigate } from "react-router-dom";
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

        if (data.username) {
          login(data);
          navigate("/dashboard/main");
        }
      } catch (err) {
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
              value={user.uid}
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
