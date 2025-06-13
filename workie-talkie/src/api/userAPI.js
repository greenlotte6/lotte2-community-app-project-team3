import axios from "axios";
import {
  CALENDAR,
  CALENDAR_ADD,
  USER_CHECKED,
  USER_LOGIN,
  USER_LOGOUT,
  USER_REGISTER,
  USER_TERMS,
  SETTING_PROFILE,
  PAGE,
  PAGE_ADD,
} from "./http";

//회원 관련
export const getTerms = async () => {
  try {
    const response = await axios.get(`${USER_TERMS}`);
    console.log(response);

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const postUser = async (data) => {
  try {
    const response = await axios.post(`${USER_REGISTER}`, data);
    console.log(response);

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const checkUserId = async (id) => {
  const resp = await fetch(`${USER_CHECKED}?id=${id}`);
  const exists = await resp.json();
  return exists; // true 또는 false
};

export const postUserLogin = async (data) => {
  try {
    const response = await axios.post(`${USER_LOGIN}`, data, {
      withCredentials: true,
    });
    console.log(response);

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const getUserLogout = async () => {
  try {
    const response = await axios.get(`${USER_LOGOUT}`, {
      withCredentials: true,
    });
    console.log(response);

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// 프로필 조회
export const getProfile = async () => {
  try {
    const response = await axios.get(`${SETTING_PROFILE}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error("프로필 요청 실패", err);
    throw err;
  }
};

// 프로필 수정
export const putProfile = async (data) => {
  try {
    const response = await axios.put(`${SETTING_PROFILE}`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error("프로필 수정 실패", err);
    throw err;
  }
};

//캘린더 관련
export const getCalendar = async () => {
  try {
    const response = await axios.get(`${CALENDAR}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error("calendar 요청 실패", err);
    throw err;
  }
};

export const postCalendar = async (data) => {
  try {
    const response = await axios.post(`${CALENDAR_ADD}`, data, {
      withCredentials: true,
    });
    console.log(response);

    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const putCalendar = async (data) => {
  try {
    const response = await axios.put(`${CALENDAR}/${data.cno}`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//페이지 관련
export const getPage = async () => {
  try {
    const response = await axios.get(`${PAGE}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error("page 요청 실패", err);
    throw err;
  }
};

export const postPage = async (data) => {
  try {
    const response = await axios.post(`${PAGE_ADD}`, data, {
      withCredentials: true,
    });
    console.log(response);

    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
