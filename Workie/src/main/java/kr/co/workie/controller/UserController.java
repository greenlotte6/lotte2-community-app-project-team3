package kr.co.workie.controller;

import kr.co.workie.dto.UserDTO;
import kr.co.workie.entity.Company;
import kr.co.workie.entity.User;
import kr.co.workie.repository.CompanyRepository;
import kr.co.workie.repository.UserRepository;
import kr.co.workie.security.MyUserDetails;
import kr.co.workie.service.EmailService;
import kr.co.workie.service.UserService;
import kr.co.workie.util.JWTProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Log4j2
@RequiredArgsConstructor
@RestController
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JWTProvider jwtProvider;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final EmailService emailService;

    //로그인
    @PostMapping("/api/user/login")
    public ResponseEntity login(@RequestBody UserDTO userDTO){
        log.info("login...1 : " + userDTO);

        try {
            // Security 인증 처리
            UsernamePasswordAuthenticationToken authToken
                    = new UsernamePasswordAuthenticationToken(userDTO.getId(), userDTO.getPass());

            // 사용자 DB 조회
            Authentication authentication = authenticationManager.authenticate(authToken);
            log.info("login...2");

            // 인증된 사용자 가져오기
            MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
            User user = userDetails.getUser();

            log.info("login...3 : " + user);

            // 토큰 발급(액세스, 리프레쉬)
            String access  = jwtProvider.createToken(user, 1); // 1일
            String refresh = jwtProvider.createToken(user, 7); // 7일

            // httpOnly cookie 생성
            ResponseCookie accessTokenCookie = ResponseCookie.from("access_token", access)

                    .httpOnly(true) //** httpOnly Cookie 생성 위함 (XSS 방지)
                    .secure(true)  //https 보안 프로토콜 적용
                    .sameSite("None")
                    .path("/")  //쿠키 경로
                    .maxAge(Duration.ofDays(1)) //쿠키 수명
                    .build();

            ResponseCookie refreshTokenCookie = ResponseCookie.from("refresh_token", refresh)
                    .httpOnly(true) //** httpOnly Cookie 생성 위함 (XSS 방지)
                    .secure(true)  //https 보안 프로토콜 적용
                    .path("/")  //쿠키 경로
                    .maxAge(Duration.ofDays(7)) //쿠키 수명
                    .build();

            // 쿠키를 Response 헤더에 추가
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
            headers.add(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

            // 🔥 액세스 토큰을 응답 본문에도 포함 (프론트엔드에서 localStorage 저장용)
            Map<String, Object> map = new HashMap<>();
            map.put("grantType", "Bearer");
            map.put("token", access);  // 🔥 추가: JWT 토큰
            map.put("username", user.getId());
            map.put("name", user.getName());
            map.put("position", user.getPosition());
            map.put("employeeId", user.getEmployeeId());
            map.put("email", user.getEmail());
            map.put("ssn", user.getSsn());
            map.put("tax", user.getTax());
            map.put("office", user.getOffice());
            map.put("department", user.getDepartment());
            map.put("hp", user.getHp());
            map.put("regDate", user.getRegDate());

            return ResponseEntity.ok().headers(headers).body(map);

        }catch (Exception e){
            log.info("login...3 : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("user not found");
        }
    }

    //회원가입(사업자)
    @PostMapping("/api/user/register")
    public Map<String, String> register(@RequestBody UserDTO userDTO){
        log.info("=== 🔍 회원가입 요청 수신 ===");
        log.info("🔍 전체 UserDTO: {}", userDTO);

        // 🔥 비어있는 필드들 체크
        if (userDTO.getName() == null || userDTO.getName().trim().isEmpty()) {
            log.warn("⚠️ name 필드가 비어있습니다!");
        }
        if (userDTO.getEmail() == null || userDTO.getEmail().trim().isEmpty()) {
            log.warn("⚠️ email 필드가 비어있습니다!");
        }
        if (userDTO.getDepartment() == null || userDTO.getDepartment().trim().isEmpty()) {
            log.warn("⚠️ department 필드가 비어있습니다!");
        }

        try {
            String userId = userService.register(userDTO);

            log.info("✅ 회원가입 성공! 생성된 사용자 ID: {}", userId);

            // 🔥 저장 후 실제 DB 데이터 확인
            User savedUser = userRepository.findById(userId).orElse(null);

            return Map.of("userid", userId);

        } catch (Exception e) {
            log.error("❌ 회원가입 실패: {}", e.getMessage(), e);
            return Map.of("error", "회원가입 실패: " + e.getMessage());
        }
    }

    //회원가입 - 초대코드(일반 회원)
    @PostMapping("/api/user/general")
    public Map<String, String> general(@RequestBody UserDTO userDTO){
        log.info("=== 🔍 회원가입 요청 수신 ===");
        log.info("🔍 전체 UserDTO: {}", userDTO);

        // 🔥 비어있는 필드들 체크
        if (userDTO.getName() == null || userDTO.getName().trim().isEmpty()) {
            log.warn("⚠️ name 필드가 비어있습니다!");
        }
        if (userDTO.getEmail() == null || userDTO.getEmail().trim().isEmpty()) {
            log.warn("⚠️ email 필드가 비어있습니다!");
        }
        if (userDTO.getDepartment() == null || userDTO.getDepartment().trim().isEmpty()) {
            log.warn("⚠️ department 필드가 비어있습니다!");
        }
        if (userDTO.getJoinCode() == null || userDTO.getJoinCode().trim().isEmpty()) {
            return Map.of("error", "초대코드가 필요합니다.");
        }

        boolean isValid = companyRepository.existsByJoinCode(userDTO.getJoinCode());
        if (!isValid) {
            return Map.of("error", "유효하지 않은 초대코드입니다.");
        }

        try {
            // 일반 회원은 무조건 MEMBER
            userDTO.setRole("MEMBER");

            // 회원 등록
            String userId = userService.register(userDTO);
            log.info("✅ 회원가입 성공: {}", userId);

            return Map.of("userid", userId);
        } catch (Exception e) {
            log.error("❌ 회원가입 실패: {}", e.getMessage());
            return Map.of("error", "회원가입 실패: " + e.getMessage());
        }
    }

    @PostMapping("/api/invite")
    public ResponseEntity<?> inviteUser(@RequestBody Map<String, String> payload, Authentication authentication) {
        String email = payload.get("email");


        if (authentication == null || !authentication.isAuthenticated()) {

            throw new AccessDeniedException("User not authenticated"); // 또는 throw new AccessDeniedException("User not authenticated");
        }

        // MyUserDetails 객체를 가져온 후, 그 안에서 실제 User 엔티티를 추출
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        String loginId = user.getId();

        Company company = companyRepository.findByCeoId(loginId);
        String joinCode = company.getJoinCode();

        String subject = "Workie 팀 초대 메일";
        String link = "http://localhost:5173/user/general?invite=" + joinCode;

        String htmlContent = """
            워크이에 초대되었습니다 🎉
            안녕하세요, %s 님께서 팀에 초대하셨습니다.
            아래 버튼을 눌러 회원가입을 완료해 주세요.
            %s
            초대받아 가입하기
            이 메일은 워크이 시스템에서 자동으로 발송되었습니다.

      
    """.formatted(user.getName(), link); // 초대한 사람 이름과 링크 삽입

        emailService.send(email, subject, htmlContent);

        return ResponseEntity.ok().build();
    }

    //아이디 중복 검사
    @GetMapping("/api/user/check")
    public ResponseEntity<Boolean> checkUserId(@RequestParam("id") String id) {
        boolean exists = userRepository.existsById(id);
        return ResponseEntity.ok(exists);
    }

    //로그아웃 위한 쿠키 삭제
    @GetMapping("/api/user/logout")
    public ResponseEntity logout(){
        // httpOnly cookie 생성
        ResponseCookie accessTokenCookie = ResponseCookie.from("access_token", "")        // -> "쿠키 저장 명"
                .httpOnly(true) //** httpOnly Cookie 생성 위함 (XSS 방지)
                .secure(false)  //https 보안 프로토콜 적용
                .path("/")  //쿠키 경로
                .maxAge(0) //쿠키 수명
                .build();

        ResponseCookie refreshTokenCookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true) //** httpOnly Cookie 생성 위함 (XSS 방지)
                .secure(false)  //https 보안 프로토콜 적용
                .path("/")  //쿠키 경로
                .maxAge(0) //쿠키 수명
                .build();

        // 쿠키를 Response 헤더에 추가
        HttpHeaders headers = new HttpHeaders();

        headers.add(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
        headers.add(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

        return ResponseEntity.ok().headers(headers).body(null);
    }

    // ======== 채팅용 API 추가 ========

    /**
     * 현재 사용자 정보 조회 (채팅용)
     */
    @GetMapping("/api/users/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        try {
            log.info("현재 사용자 정보 조회 요청");
            UserDTO currentUser = userService.getCurrentUser();

            // 🔥 현재 사용자 정보 상세 로깅
            log.info("=== 🔍 현재 사용자 정보 ===");
            log.info("🔍 사용자 DTO: {}", currentUser);
            log.info("🔍 ID: '{}'", currentUser.getId());
            log.info("🔍 이름: '{}'", currentUser.getName());
            log.info("🔍 사원번호: '{}'", currentUser.getEmployeeId());
            log.info("🔍 이메일: '{}'", currentUser.getEmail());
            log.info("🔍 역할: '{}'", currentUser.getRole());
            log.info("🔍 부서: '{}'", currentUser.getDepartment());
            log.info("🔍 직책: '{}'", currentUser.getPosition());
            log.info("=======================");

            return ResponseEntity.ok(currentUser);
        } catch (Exception e) {
            log.error("현재 사용자 정보 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    /**
     * 사용자 검색 API (DM/채널 멤버 추가용)
     */
    @GetMapping("/users/search")  // 🔥 /api 제거
    public ResponseEntity<List<UserDTO>> searchUsersForFrontend(@RequestParam("q") String query) {
        try {
            log.info("프론트엔드용 사용자 검색 요청: query='{}'", query);

            if (query == null || query.trim().isEmpty()) {
                log.warn("검색어가 비어있습니다");
                return ResponseEntity.badRequest().build();
            }

            List<UserDTO> users = userService.searchUsersByName(query.trim());
            log.info("사용자 검색 성공: {}개 결과", users.size());

            return ResponseEntity.ok(users);
        } catch (Exception e) {
            log.error("사용자 검색 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 모든 활성 사용자 조회 (관리자용)
     */
    @GetMapping("/api/users/active")
    public ResponseEntity<List<UserDTO>> getAllActiveUsers() {
        try {
            log.info("모든 활성 사용자 조회 요청");
            List<UserDTO> users = userService.getAllActiveUsers();
            log.info("활성 사용자 조회 성공: {}명", users.size());
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            log.error("활성 사용자 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 멤버 선택을 위한 사용자 목록 조회 (채팅용)
     */
    @GetMapping("/api/users/members")
    public ResponseEntity<List<UserDTO>> getAvailableMembers() {
        try {
            log.info("멤버 목록 조회 요청");
            List<UserDTO> members = userService.getAvailableMembers();
            log.info("멤버 목록 조회 성공, 개수: {}", members.size());
            return ResponseEntity.ok(members);
        } catch (Exception e) {
            log.error("멤버 목록 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 특정 사용자 정보 조회 (채팅용)
     */
    @GetMapping("/api/users/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable String userId) {
        try {
            log.info("사용자 정보 조회 요청: userId={}", userId);
            UserDTO user = userService.getUserById(userId);
            log.info("사용자 정보 조회 성공: {}", user.getName());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            log.error("사용자 정보 조회 실패: userId={}, error={}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * 여러 사용자의 온라인 상태 조회 (DM용)
     */
    @PostMapping("/api/users/online-status")
    public ResponseEntity<Map<String, Boolean>> getUserOnlineStatus(@RequestBody Map<String, List<String>> request) {
        try {
            List<String> userIds = request.get("userIds");
            log.info("온라인 상태 조회 요청: {} 명", userIds.size());

            // 현재는 모든 사용자를 온라인으로 처리 (실제로는 WebSocket 연결 상태 확인)
            Map<String, Boolean> statusMap = new HashMap<>();
            for (String userId : userIds) {
                // TODO: 실제 온라인 상태 확인 로직 구현
                statusMap.put(userId, Math.random() > 0.5); // 임시로 랜덤 상태
            }

            log.info("온라인 상태 조회 완료");
            return ResponseEntity.ok(statusMap);
        } catch (Exception e) {
            log.error("온라인 상태 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

/*
    @GetMapping("/terms")
    public ResponseEntity terms(){
        TermsDTO termsDTO = userService.terms();
        log.info("terms : " + termsDTO);

        return ResponseEntity.ok(termsDTO);
    }
 */

}