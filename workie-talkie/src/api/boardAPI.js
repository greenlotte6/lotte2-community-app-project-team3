import axios from "axios";
import {
  BOARD,
  BOARD_WRITE,
  BOARD_PINNED,
  BOARD_NOTICES,
  BOARD_FREES,
  BOARD_MENUS,
  BOARD_IMPORTANT,
  BOARD_RECENT,
  BOARD_DELETE,
} from "./http";

//게시판 관련
export const postBoard = async (boardData) => {
  try {
    const response = await axios.post(`${BOARD_WRITE}`, boardData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("게시글 저장 실패:", error);
    throw error;
  }
};

export const putArticle = async (data) => {
  try {
    const response = await axios.put(`${BOARD}/${data.ano}`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("게시물 수정 실패:", error);
    throw error;
  }
};

export const deleteArticle = async (ano) => {
  try {
    const response = await axios.delete(`${BOARD_DELETE}/${ano}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("게시물 삭제 실패:", error);
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

export const getArticle = async (category, ano) => {
  try {
    const response = await axios.get(`${BOARD}/${category}/${ano}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("게시물 보기 실패:", error);
    throw error;
  }
};

export const putPinned = async (data) => {
  try {
    const response = await axios.put(`${BOARD_PINNED}/${data.ano}`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("상단 고정하기 실패:", error);
    throw error;
  }
};

export const getNotices = async () => {
  try {
    const response = await axios.get(`${BOARD_NOTICES}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("공지사항 불러오기 실패:", error);
    throw error;
  }
};

export const getImportantNotices = async () => {
  try {
    const response = await axios.get(`${BOARD_IMPORTANT}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("중요공지 불러오기 실패:", error);
    throw error;
  }
};

export const getFrees = async () => {
  try {
    const response = await axios.get(`${BOARD_FREES}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("자유게시판 불러오기 실패:", error);
    throw error;
  }
};

export const getMenus = async () => {
  try {
    const response = await axios.get(`${BOARD_MENUS}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("식단표 불러오기 실패:", error);
    throw error;
  }
};

export const getRecent = async () => {
  try {
    const response = await axios.get(`${BOARD_RECENT}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("최근 게시물 불러오기 실패:", error);
    throw error;
  }
};
