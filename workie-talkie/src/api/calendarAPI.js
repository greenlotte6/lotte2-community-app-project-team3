import axios from "./axios";
import { CALENDAR_ADD, CALENDAR } from "./http";

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
