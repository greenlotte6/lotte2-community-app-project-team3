package kr.co.workie.controller;

import kr.co.workie.dto.UserDTO;
import kr.co.workie.entity.User;
import kr.co.workie.repository.UserRepository;
import kr.co.workie.security.MyUserDetails;
import kr.co.workie.service.UserService;
import kr.co.workie.util.JWTProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
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

    @PostMapping("/user/login")
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

            // 리프레쉬 토큰 DB 저장

            // httpOnly cookie 생성
            // -> "쿠키 저장 명"
            ResponseCookie accessTokenCookie = ResponseCookie.from("access_token", access)
                    .httpOnly(true) //** httpOnly Cookie 생성 위함 (XSS 방지)
                    .secure(false)  //https 보안 프로토콜 적용
                    .path("/")  //쿠키 경로
                    .maxAge(Duration.ofDays(1)) //쿠키 수명
                    .build();

            ResponseCookie refreshTokenCookie = ResponseCookie.from("refresh_token", refresh)
                    .httpOnly(true) //** httpOnly Cookie 생성 위함 (XSS 방지)
                    .secure(false)  //https 보안 프로토콜 적용
                    .path("/")  //쿠키 경로
                    .maxAge(Duration.ofDays(7)) //쿠키 수명
                    .build();

            // 쿠키를 Response 헤더에 추가
            HttpHeaders headers = new HttpHeaders();

            headers.add(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
            headers.add(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

            // 액세스 토큰 클라이언트 전송
            Map<String, Object> map = new HashMap<>();
            map.put("grantType", "Bearer");
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

    @PostMapping("/user/register")
    public Map<String, String> register(@RequestBody UserDTO userDTO){
        log.info("=== 🔍 회원가입 요청 수신 ===");
        log.info("🔍 전체 UserDTO: {}", userDTO);

        // 🔥 각 필드별 상세 로깅
        log.info("🔍 받은 필드들:");
        log.info("  - id: '{}'", userDTO.getId());
        log.info("  - pass: '{}'", userDTO.getPass() != null ? "***있음***" : "null");
        log.info("  - name: '{}'", userDTO.getName());
        log.info("  - email: '{}'", userDTO.getEmail());
        log.info("  - employeeId: '{}'", userDTO.getEmployeeId());
        log.info("  - department: '{}'", userDTO.getDepartment());
        log.info("  - position: '{}'", userDTO.getPosition());
        log.info("  - office: '{}'", userDTO.getOffice());
        log.info("  - hp: '{}'", userDTO.getHp());
        log.info("  - role: '{}'", userDTO.getRole());
        log.info("  - companyName: '{}'", userDTO.getCompanyName());

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
            if (savedUser != null) {
                log.info("=== 🔍 실제 저장된 데이터 확인 ===");
                log.info("🔍 저장된 사용자: {}", savedUser);
                log.info("🔍 저장된 name: '{}'", savedUser.getName());
                log.info("🔍 저장된 email: '{}'", savedUser.getEmail());
                log.info("🔍 저장된 employeeId: '{}'", savedUser.getEmployeeId());
                log.info("🔍 저장된 department: '{}'", savedUser.getDepartment());
                log.info("🔍 저장된 position: '{}'", savedUser.getPosition());
                log.info("🔍 저장된 role: '{}'", savedUser.getRole());
                log.info("===============================");
            } else {
                log.error("❌ 저장된 사용자를 찾을 수 없습니다!");
            }

            return Map.of("userid", userId);

        } catch (Exception e) {
            log.error("❌ 회원가입 실패: {}", e.getMessage(), e);
            return Map.of("error", "회원가입 실패: " + e.getMessage());
        }
    }

    @GetMapping("/user/check")
    public ResponseEntity<Boolean> checkUserId(@RequestParam("id") String id) {
        boolean exists = userRepository.existsById(id);
        return ResponseEntity.ok(exists);
    }

    //로그아웃 위한 쿠키 삭제
    @GetMapping("/user/logout")
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

    // 현재 사용자 정보 조회 (채팅용)
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
            return ResponseEntity.badRequest().build();
        }
    }

    // 멤버 선택을 위한 사용자 목록 조회 (채팅용)
    @GetMapping("/api/users/members")
    public ResponseEntity<List<UserDTO>> getAvailableMembers() {
        try {
            log.info("멤버 목록 조회 요청");
            List<UserDTO> members = userService.getAvailableMembers();
            log.info("멤버 목록 조회 성공, 개수: {}", members.size());
            return ResponseEntity.ok(members);
        } catch (Exception e) {
            log.error("멤버 목록 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 특정 사용자 정보 조회 (채팅용)
    @GetMapping("/api/users/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable String userId) {
        try {
            log.info("사용자 정보 조회 요청: userId={}", userId);
            UserDTO user = userService.getUserById(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            log.error("사용자 정보 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
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