// 베포 테스트
const isLocalhost = window.location.hostname.includes("localhost");

const SERVER_HOST = isLocalhost
  ? "http://localhost:8080"
  : "https://workie-talkie.site"; // 운영(프론트/백 분리면 경로 맞춰줘야 함)

//user
export const USER = `${SERVER_HOST}/api/user`;

export const USER_TERMS = `${USER}/policies`; //약관
export const USER_REGISTER = `${USER}/register`; //실제 회원가입 요청 API
export const USER_GENERAL = `${USER}/general`; //일반 회원가입 요청 API
export const USER_CHECKED = `${USER}/check`; //사용자 ID 중복 확인 API
export const USER_LOGIN = `${USER}/login`; //로그인
export const USER_LOGOUT = `${USER}/logout`; //로그아웃
export const USER_INVITE = `${USER}/invite`; //로그아웃

//setting
export const SETTING = `${SERVER_HOST}/setting`;

export const SETTING_PROFILE = `${SETTING}/profile`; //프로필설정
export const SETTING_MESSAGE = `${SETTING}/message`; //프로필설정
export const SETTING_CALENDAR = `${SETTING}/calendar`; //프로필설정
export const SETTING_PAGE = `${SETTING}/page`; //페이지
export const SETTING_DRIVE = `${SETTING}/drive`; //프로필설정
export const SETTING_PROJECT = `${SETTING}/project`; //프로젝트
export const SETTING_MEMBERS = `${SETTING}/member`; //회원관리
export const SETTING_BOARD = `${SETTING}/board`; //게시판
export const SETTING_PLAN = `${SETTING}/plan`; //요금제

//app
export const CALENDAR = `${SERVER_HOST}/calendar`;
export const PAGE = `${SERVER_HOST}/page`;
export const BOARD = `${SERVER_HOST}/board`;
export const PROJECT = `${SERVER_HOST}/api/project`;

export const CALENDAR_ADD = `${CALENDAR}/add`;
export const CALENDAR_DASHBOARD = `${CALENDAR}/upcoming`;

export const PAGE_ADD = `${PAGE}/add`;
export const PAGE_FAVORITE = `${PAGE}/favorite`;
export const PAGE_TOTAL = `${PAGE}/count`;
export const PAGE_RECENT = `${PAGE}/recent`;
export const PAGE_PARENT = `${PAGE}/parent`;
export const PAGE_DELETE = `${PAGE}/delete`;
export const PAGE_RECOVER = `${PAGE}/recover`;

//board
export const BOARD_MAIN = `${BOARD}/main`;
export const BOARD_WRITE = `${BOARD}/write`;
export const BOARD_DELETE = `${BOARD}/delete`;
export const BOARD_PINNED = `${BOARD}/pinned`;

export const BOARD_NOTICES = `${BOARD}/notices`;
export const BOARD_IMPORTANT = `${BOARD}/required`;
export const BOARD_FREES = `${BOARD}/frees`;
export const BOARD_RECENT = `${BOARD}/recent`;
export const BOARD_MENUS = `${BOARD}/menus`;
export const BOARD_COMMENTS = `${BOARD}/comments`;

//project
export const PROJECT_ADD = `${PROJECT}/create`;
