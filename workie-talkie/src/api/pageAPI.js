import axios from "axios";
import {
  PAGE,
  PAGE_ADD,
  PAGE_FAVORITE,
  PAGE_TOTAL,
  PAGE_RECENT,
  PAGE_PARENT,
  PAGE_DELETE,
  PAGE_RECOVER,
} from "./http";

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
  console.log("putFavoritePage 내부 data:", data); // ✨ 이 로그 추가 ✨
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
