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
  USER_INVITE,
  SETTING_MEMBERS,
  BOARD,
  BOARD_WRITE,
  PAGE_DELETE,
  PAGE_RECOVER,
} from "./http";

const token = localStorage.getItem("token");

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

export const postUserInvite = async (data) => {
  try {
    const response = await axios.post(USER_INVITE, data, {
      withCredentials: true,
    });
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

// 멤버 리스트 조회
export const getMembers = async () => {
  try {
    const response = await axios.get(`${SETTING_MEMBERS}`, {
      withCredentials: true,
    });

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
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (err) {
    console.error("멤버 정보 변경 실패", err);

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

export const deleteCalendar = async (cno) => {
  try {
    const response = await axios.delete(`${CALENDAR}/${cno}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error("❌ 일정 삭제 실패", err);
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

export const deletePageByPno = async (pno) => {
  try {
    const response = await axios.delete(`${PAGE}/${pno}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error("❌ 페이지 삭제 실패", err);
    throw err;
  }
};

export const softDeletePage = async (pno) => {
  try {
    const response = await axios.put(
      `${PAGE_DELETE}/${pno}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const recoveryPage = async (pno) => {
  try {
    const response = await axios.put(
      `${PAGE_RECOVER}/${pno}`,
      {},
      {
        withCredentials: true,
      }
    );
    console.log("PAGE_RECOVER:", PAGE_RECOVER);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

//게시판 관련
export const postBoard = async (boardData) => {
  try {
    const res = await axios.post(`${BOARD_WRITE}`, boardData, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("게시글 저장 실패:", error);
    throw error;
  }
};

export const getBoardList = async (category) => {
  try {
    const response = await axios.get(`${BOARD}/${category}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("리스트 불러오기 실패:", error);
    throw error;
  }
};
