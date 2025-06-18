import axiosInstance from "@/api/axiosInstance";
import { useEffect } from "react";

const TokenTest = () => {
  useEffect(() => {
    axiosInstance
      .get("/api/drive", {
        params: { parentId: null },
      })
      .then((res) => {
        console.log("✅ 응답 성공", res.data);
      })
      .catch((err) => {
        console.error("❌ 에러 발생", err);
      });
  }, []);

  return <div>토큰 테스트 중...</div>;
};

export default TokenTest;
