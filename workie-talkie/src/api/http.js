const SERVER_HOST = "http://localhost:8080"; // 서버주소

//user
export const USER = `${SERVER_HOST}/user`;

export const USER_TERMS = `${USER}/policies`; //약관
export const USER_REGISTER = `${USER}/register`; //실제 회원가입 요청 API
export const USER_CHECKED = `${USER}/check`; //사용자 ID 중복 확인 API
export const USER_LOGIN = `${USER}/login`; //로그인
export const USER_LOGOUT = `${USER}/logout`; //로그아웃

//setting
export const SETTING = `${SERVER_HOST}/setting`;

export const SETTING_PROFILE = `${SETTING}/profile`; //프로필설정
export const SETTING_MESSAGE = `${SETTING}/message`; //프로필설정
export const SETTING_CALENDAR = `${SETTING}/calendar`; //프로필설정
export const SETTING_PAGE = `${SETTING}/page`; //페이지
export const SETTING_DRIVE = `${SETTING}/drive`; //프로필설정

export const SETTING_PROJECT = `${SETTING}/project`; //프로젝트
export const SETTING_MEMBER = `${SETTING}/member`; //프로젝트
export const SETTING_BOARD = `${SETTING}/board`; //게시판
export const SETTING_PLAN = `${SETTING}/plan`; //요금제

//app
export const CALENDAR = `${SERVER_HOST}/calendar`;
export const CALENDAR_ADD = `${CALENDAR}/add`;
