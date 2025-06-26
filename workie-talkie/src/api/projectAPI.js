import axios from "./axios";
import { PROJECT, PROJECT_ADD } from "./http";

export const postProject = async (data) => {
  try {
    const response = await axios.post(`${PROJECT_ADD}`, data, {
      withCredentials: true,
    });
    console.log(response);

    return response.data;
  } catch (error) {
    console.error("프로젝트 추가 실패", error);
    throw error;
  }
};

export const getProject = async () => {
  try {
    const response = await axios.get(`${PROJECT}`, {
      withCredentials: true,
    });
    console.log(response);

    return response.data;
  } catch (error) {
    console.error("프로젝트 리스트 요청 실패", error);

    throw error;
  }
};

export const putProject = async () => {};

export const deleteProject = async () => {};
