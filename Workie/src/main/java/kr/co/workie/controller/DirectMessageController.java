package kr.co.workie.controller;

import kr.co.workie.dto.DirectMessageDTO;
import kr.co.workie.service.DirectMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/dm")
public class DirectMessageController {

    private final DirectMessageService directMessageService;

    // DM 시작하기
    @PostMapping
    public ResponseEntity<?> startDirectMessage(@RequestBody DirectMessageDTO.CreateRequest request) {
        log.info("=== 🔥 DM 생성 요청 디버깅 ===");
        log.info("🔥 HTTP Method: POST");
        log.info("🔥 Request Path: /api/dm");
        log.info("🔥 Request Body: {}", request);
        log.info("🔥 Target User ID: {}", request != null ? request.getTargetUserId() : "null");

        // 🔥 인증 정보 확인
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        log.info("🔥 Authentication: {}", auth);
        log.info("🔥 Principal: {}", auth != null ? auth.getPrincipal() : "null");
        log.info("🔥 Principal Type: {}", auth != null && auth.getPrincipal() != null ? auth.getPrincipal().getClass().getName() : "null");
        log.info("🔥 Is Authenticated: {}", auth != null ? auth.isAuthenticated() : "false");

        try {
            DirectMessageDTO.Response response = directMessageService.startDirectMessage(request);
            log.info("🔥 DM 생성 성공: dmId={}, roomId={}", response.getId(), response.getRoomId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("🔥 DM 생성 실패 - 상세 오류:", e);

            // 🔥 더 자세한 에러 응답
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("errorClass", e.getClass().getSimpleName());
            errorResponse.put("timestamp", LocalDateTime.now().toString());
            errorResponse.put("path", "/api/dm");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    // 🔥 DM 목록 조회를 명시적인 경로로 변경
    @GetMapping("/list")
    public ResponseEntity<List<DirectMessageDTO.ListResponse>> getUserDirectMessages() {
        try {
            log.info("DM 목록 조회 요청");
            List<DirectMessageDTO.ListResponse> dmList = directMessageService.getUserDirectMessages();
            log.info("DM 목록 조회 성공, 개수: {}", dmList.size());
            return ResponseEntity.ok(dmList);
        } catch (Exception e) {
            log.error("DM 목록 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 🔥 roomId로 조회하는 매핑을 위로 이동 (우선순위 높임)
    @GetMapping("/room/{roomId}")
    public ResponseEntity<DirectMessageDTO.Response> getDirectMessageByRoomId(@PathVariable String roomId) {
        try {
            log.info("roomId로 DM 조회 요청: roomId={}", roomId);
            DirectMessageDTO.Response response = directMessageService.getDirectMessageByRoomId(roomId);
            log.info("roomId로 DM 조회 성공: roomId={}", roomId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("roomId로 DM 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 🔥 DM 상세 정보 조회 (가장 아래로 이동)
    @GetMapping("/{dmId}")
    public ResponseEntity<DirectMessageDTO.Response> getDirectMessageById(@PathVariable Long dmId) {
        try {
            log.info("DM 상세 조회 요청: dmId={}", dmId);
            DirectMessageDTO.Response response = directMessageService.getDirectMessageById(dmId);
            log.info("DM 상세 조회 성공: dmId={}", dmId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("DM 상세 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // DM 삭제
    @DeleteMapping("/{dmId}")
    public ResponseEntity<Void> deleteDirectMessage(@PathVariable Long dmId) {
        try {
            log.info("DM 삭제 요청: dmId={}", dmId);
            directMessageService.deleteDirectMessage(dmId);
            log.info("DM 삭제 성공: dmId={}", dmId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("DM 삭제 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}