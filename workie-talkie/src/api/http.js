// 베포 테스트
const isLocalhost = window.location.hostname.includes("localhost");
const isHttps = window.location.protocol === "https:";

// 배포 환경 서버 호스트 지정
const SERVER_HOST = isLocalhost
  ? "http://localhost:8080"
  : "https://3.36.66.1:8080"; // 운영(프론트/백 분리면 경로 맞춰줘야 함)

const WS_HOST = isLocalhost ? "localhost:8080" : "3.36.66.1:8080";
const HTTP_PROTOCOL = isHttps ? "https" : "http";
const WS_PROTOCOL = isHttps ? "wss" : "ws";

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
export const PAGE = `${SERVER_HOST}/page`;

export const CALENDAR_ADD = `${CALENDAR}/add`;

export const PAGE_ADD = `${PAGE}/add`;
export const PAGE_FAVORITE = `${PAGE}/favorite`;
export const PAGE_TOTAL = `${PAGE}/count`;
export const PAGE_RECENT = `${PAGE}/recent`;
export const PAGE_PARENT = `${PAGE}/parent`;
