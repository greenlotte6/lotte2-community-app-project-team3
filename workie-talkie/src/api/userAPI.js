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
  PAGE_FAVORITE,
  PAGE_TOTAL,
  PAGE_RECENT,
  PAGE_PARENT,
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

export const putFavoritePage = async (data) => {
  console.log("userAPI.js putFavoritePage 내부 data:", data); // ✨ 이 로그 추가 ✨
  try {
    const response = await axios.put(`${PAGE_FAVORITE}/${data.pno}`, data, {
      withCredentials: true,
    });
    console.log(response);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const putPage = async (data) => {
  try {
    const response = await axios.put(`${PAGE}/${data.pno}`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getPageByPno = async (pno) => {
  try {
    const response = await axios.get(`${PAGE}/${pno}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getTotal = async () => {
  try {
    const response = await axios.get(`${PAGE_TOTAL}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error("페이지 총 갯수 요청 실패", err);
    throw err;
  }
};

export const getRecent = async () => {
  try {
    const response = await axios.get(`${PAGE_RECENT}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error("최근페이지 요청 실패", err);
    throw err;
  }
};

export const getParent = async () => {
  try {
    const response = await axios.get(`${PAGE_PARENT}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error("부모페이지 요청 실패", err);
    throw err;
  }
};
