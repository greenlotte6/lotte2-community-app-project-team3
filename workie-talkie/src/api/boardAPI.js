import axios from "./axios";
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
  BOARD_COMMENTS,
} from "./http";

//게시판 관련
export const postBoard = async (boardData) => {
  try {
    const response = await axios.post(`${BOARD_WRITE}`, boardData, {});
    return response.data;
  } catch (error) {
    console.error("게시글 저장 실패:", error);
    throw error;
  }
};

export const putArticle = async (data) => {
  try {
    const response = await axios.put(`${BOARD}/${data.ano}`, data, {});
    return response.data;
  } catch (error) {
    console.error("게시물 수정 실패:", error);
    throw error;
  }
};

export const deleteArticle = async (ano) => {
  try {
    const response = await axios.delete(`${BOARD_DELETE}/${ano}`, {});
    return response.data;
  } catch (error) {
    console.error("게시물 삭제 실패:", error);
    throw error;
  }
};

export const getBoardList = async (category) => {
  try {
    const response = await axios.get(`${BOARD}/${category}`, {});
    return response.data;
  } catch (error) {
    console.error("리스트 불러오기 실패:", error);
    throw error;
  }
};

export const getArticle = async (category, ano) => {
  try {
    const response = await axios.get(`${BOARD}/${category}/${ano}`, {});
    return response.data;
  } catch (error) {
    console.error("게시물 보기 실패:", error);
    throw error;
  }
};

export const putPinned = async (data) => {
  try {
    const response = await axios.put(`${BOARD_PINNED}/${data.ano}`, data, {});
    return response.data;
  } catch (error) {
    console.error("상단 고정하기 실패:", error);
    throw error;
  }
};

export const getNotices = async () => {
  try {
    const response = await axios.get(`${BOARD_NOTICES}`, {});
    return response.data;
  } catch (error) {
    console.error("공지사항 불러오기 실패:", error);
    throw error;
  }
};

export const getImportantNotices = async () => {
  try {
    const response = await axios.get(`${BOARD_IMPORTANT}`, {});
    return response.data;
  } catch (error) {
    console.error("중요공지 불러오기 실패:", error);
    throw error;
  }
};

export const getFrees = async () => {
  try {
    const response = await axios.get(`${BOARD_FREES}`, {});
    return response.data;
  } catch (error) {
    console.error("자유게시판 불러오기 실패:", error);
    throw error;
  }
};

export const getMenus = async () => {
  try {
    const response = await axios.get(`${BOARD_MENUS}`, {});
    return response.data;
  } catch (error) {
    console.error("식단표 불러오기 실패:", error);
    throw error;
  }
};

export const getRecent = async () => {
  try {
    const response = await axios.get(`${BOARD_RECENT}`, {});
    return response.data;
  } catch (error) {
    console.error("최근 게시물 불러오기 실패:", error);
    throw error;
  }
};

//댓글
export const getComments = async (ano) => {
  try {
    const response = await axios.get(`${BOARD_COMMENTS}/${ano}`, {});
    return response.data;
  } catch (error) {
    console.error("댓글 조회 실패:", error);
    throw error;
  }
};

export const postComment = async (ano, comment) => {
  try {
    const response = await axios.post(`${BOARD_COMMENTS}/${ano}`, comment, {});
    return response.data;
  } catch (error) {
    console.error("댓글 작성 실패:", error);
    throw error;
  }
};

export const putComment = async (data) => {
  try {
    const response = await axios.put(`${BOARD_COMMENTS}/${data.cno}`, data, {});
    return response.data;
  } catch (error) {
    console.error("댓글 수정 실패:", error);
    throw error;
  }
};

export const deleteComment = async (cno) => {
  try {
    const response = await axios.delete(`${BOARD_COMMENTS}/${cno}`, {});
    return response.data;
  } catch (error) {
    console.error("댓글 삭제 실패", error);
    throw error;
  }
};
