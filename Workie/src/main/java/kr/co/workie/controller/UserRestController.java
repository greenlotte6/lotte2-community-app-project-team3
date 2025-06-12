package kr.co.workie.controller;

import kr.co.workie.dto.UserDTO;
import kr.co.workie.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserRestController {

    private final UserService userService; // 인터페이스 사용

    /**
     * 현재 로그인한 사용자 정보 조회
     * 프론트엔드 ChatContext에서 사용
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            log.debug("현재 사용자 정보 조회 요청");

            // 🔥 UserService.getCurrentUser() 사용 (이미 Spring Security 통합됨)
            UserDTO currentUser = userService.getCurrentUser();

            if (currentUser == null) {
                log.warn("현재 사용자 정보 조회 실패 - 로그인되지 않은 사용자");
                return ResponseEntity.status(401).body(Map.of("error", "인증이 필요합니다"));
            }

            log.info("현재 사용자 정보 조회 성공 - ID: {}, 이름: {}",
                    currentUser.getId(), currentUser.getName());

            // 🔥 클라이언트로 전송할 사용자 정보 구성
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", currentUser.getId());
            userInfo.put("name", currentUser.getName());
            userInfo.put("employeeId", currentUser.getEmployeeId());
            userInfo.put("email", currentUser.getEmail());
            userInfo.put("hp", currentUser.getHp());
            userInfo.put("role", currentUser.getRole());
            userInfo.put("position", currentUser.getPosition());
            userInfo.put("department", currentUser.getDepartment());
            userInfo.put("office", currentUser.getOffice());

            return ResponseEntity.ok(userInfo);

        } catch (Exception e) {
            log.error("현재 사용자 정보 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "서버 오류가 발생했습니다"));
        }
    }

    /**
     * 채팅 멤버 목록 조회 (채널 생성 시 사용)
     */
    @GetMapping("/members")
    public ResponseEntity<?> getAvailableMembers() {
        try {
            log.debug("사용 가능한 멤버 목록 조회 요청");

            // 🔥 UserService.getAvailableMembers() 사용
            var members = userService.getAvailableMembers();

            log.info("멤버 목록 조회 성공 - 총 {}명", members.size());

            return ResponseEntity.ok(members);

        } catch (Exception e) {
            log.error("멤버 목록 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "서버 오류가 발생했습니다"));
        }
    }
}