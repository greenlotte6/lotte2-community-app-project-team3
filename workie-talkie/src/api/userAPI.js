import axios from "./axios";
import {
  USER_CHECKED,
  USER_LOGIN,
  USER_LOGOUT,
  USER_REGISTER,
  USER_TERMS,
  USER_INVITE,
  CALENDAR_DASHBOARD,
} from "./http";

//회원 관련
export const getTerms = async () => {
  try {
    const response = await axios.get(`${USER_TERMS}`);
    console.log(response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const postUser = async (data) => {
  try {
    const response = await axios.post(`${USER_REGISTER}`, data);
    console.log(response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const postUserInvite = async (data) => {
  try {
    const response = await axios.post(USER_INVITE, data, {});
    return response.data;
  } catch (error) {
    console.error("❌ 초대 실패:", error);
    throw error;
  }
};

export const checkUserId = async (id) => {
  const resp = await fetch(`${USER_CHECKED}?id=${id}`, {
    method: "GET",
    credentials: "omit", // 인증 관련 쿠키 아예 안 보냄
  });

  if (!resp.ok) throw new Error("ID 체크 실패");

  const exists = await resp.json();
  return exists;
};

export const postUserLogin = async (data) => {
  try {
    const response = await axios.post(`${USER_LOGIN}`, data, {});
    console.log(response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getUserLogout = async () => {
  try {
    const response = await axios.get(`${USER_LOGOUT}`, {});
    console.log(response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getUpcomingEvents = async () => {
  try {
    const response = await axios.get(`${CALENDAR_DASHBOARD}`, {});
    console.log(response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
