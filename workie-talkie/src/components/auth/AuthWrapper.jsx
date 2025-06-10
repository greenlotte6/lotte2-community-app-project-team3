import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useLoginStore } from "../../stores/useLoginStore";

export const AuthWrapper = () => {
  const user = useLoginStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    // user 객체가 없거나 (로그아웃 상태), user.username이 비어있는 경우
    if (!user || !user.username) {
      console.log("User is not authenticated. Redirecting to login.");

      // 로그인 페이지 또는 랜딩 페이지로 리다이렉트
      navigate("/user/login", { replace: true });
    }
  }, [user, navigate]); // user 상태나 navigate 함수가 변경될 때마다 실행

  // user 정보가 있다면 (인증된 상태), 하위 라우트 컴포넌트를 렌더링
  // user 정보가 없다면, useEffect에서 리다이렉트가 발생하므로 여기는 실행되지 않습니다.
  return user && user.username ? <Outlet /> : null;
};
