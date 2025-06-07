import React from "react";
import { LandingLayout } from "../../layouts/LandingLayout";

export const Login = () => {
  return (
    <LandingLayout>
      <div id="login-container">
        <div className="login">
          <h1>로그인</h1>
          <p>Please log in to continue</p>

          <input type="email" placeholder="Email Address" />
          <input type="password" placeholder="Password" />
          <div className="password-hint">
            It must be a combination of minimum 8 letters, numbers, and symbols.
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="/register/findId.html">Forgot ID?</a>
            <a href="/register/findPassword.html">Forgot Password?</a>
          </div>

          <a href="/dashboard/dashboard.html">
            <button className="login-btn">Log In</button>
          </a>

          <div className="social-login">
            <p>Or log in with:</p>
            <div className="social-buttons">
              <button>G&nbsp; Google</button>
              <button> Apple</button>
              <button> Twitter</button>
            </div>
          </div>

          <div className="signup-link">
            No account yet? <a href="/register/signUp.html">Sign Up</a>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
};
