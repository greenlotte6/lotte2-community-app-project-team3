import axios from "./axios";
import { SETTING_PROFILE, SETTING_MEMBERS } from "./http";

// 프로필 조회
export const getProfile = async () => {
  try {
    const response = await axios.get(`${SETTING_PROFILE}`, {});
    return response.data;
  } catch (err) {
    console.error("프로필 요청 실패", err);
    throw err;
  }
};

// 프로필 수정
export const putProfile = async (data) => {
  try {
    const response = await axios.put(`${SETTING_PROFILE}`, data, {});
    return response.data;
  } catch (err) {
    console.error("프로필 수정 실패", err);
    throw err;
  }
};

// 멤버 리스트 조회
export const getMembers = async () => {
  try {
    const response = await axios.get(`${SETTING_MEMBERS}`, {});

    return response.data;
  } catch (err) {
    console.error("멤버 불러오기 실패", err);

    throw err;
  }
};

// 멤버 정보 수정
export const putMembers = async (member) => {
  try {
    const response = await axios.put(
      `${SETTING_MEMBERS}/${member.id}`,
      member,
      {}
    );

    return response.data;
  } catch (err) {
    console.error("멤버 정보 변경 실패", err);

    throw err;
  }
};
