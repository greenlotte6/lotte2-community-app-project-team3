// 1. ChannelController.java 수정
package kr.co.workie.controller;

import kr.co.workie.dto.ChannelDTO;
import kr.co.workie.entity.User;
import kr.co.workie.security.MyUserDetails;
import kr.co.workie.service.ChannelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/channels") // 🔥 /api 제거 - 프론트엔드와 일치
@CrossOrigin(origins = "*") // 개발용
public class ChannelController {

    private final ChannelService channelService;

    // 🏥 헬스 체크 추가
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "OK",
                "service", "channels",
                "timestamp", java.time.LocalDateTime.now().toString()
        ));
    }

    // 채널 생성
    @PostMapping
    public ResponseEntity<?> createChannel(
            @RequestBody ChannelDTO.CreateRequest request,
            Authentication authentication) { // 🔥 인증 정보 추가
        try {
            log.info("채널 생성 요청: {}", request);

            // 🔥 인증 확인
            if (authentication == null || !authentication.isAuthenticated()) {
                log.warn("인증되지 않은 사용자의 채널 생성 시도");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "인증이 필요합니다."));
            }

            String currentUserId = getCurrentUserId(authentication);
            log.info("현재 사용자: {}", currentUserId);

            // 🔥 서비스 호출 시 현재 사용자 정보 전달
            ChannelDTO.Response response = channelService.createChannel(request, currentUserId);

            log.info("채널 생성 성공: {}", response);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.error("잘못된 요청: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("채널 생성 실패: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "채널 생성에 실패했습니다."));
        }
    }

    // 사용자가 참여한 채널 목록 조회
    @GetMapping
    public ResponseEntity<?> getUserChannels(Authentication authentication) {
        try {
            log.info("사용자 채널 목록 조회 요청");

            // 🔥 인증 확인
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "인증이 필요합니다."));
            }

            String currentUserId = getCurrentUserId(authentication);
            log.info("사용자 {} 채널 목록 조회", currentUserId);

            List<ChannelDTO.ListResponse> channels = channelService.getUserChannels(currentUserId);
            log.info("채널 목록 조회 성공, 개수: {}", channels.size());
            return ResponseEntity.ok(channels);

        } catch (Exception e) {
            log.error("채널 목록 조회 실패: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "채널 목록을 불러올 수 없습니다."));
        }
    }

    // 채널 상세 정보 조회
    @GetMapping("/{channelId}")
    public ResponseEntity<?> getChannelById(
            @PathVariable Long channelId,
            Authentication authentication) {
        try {
            log.info("채널 상세 조회 요청: channelId={}", channelId);

            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "인증이 필요합니다."));
            }

            String currentUserId = getCurrentUserId(authentication);
            ChannelDTO.Response response = channelService.getChannelById(channelId, currentUserId);

            log.info("채널 상세 조회 성공: {}", response);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("채널 상세 조회 실패: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "채널 정보를 불러올 수 없습니다."));
        }
    }

    // 채널 나가기 (POST로 변경 - 프론트엔드와 일치)
    @PostMapping("/{channelId}/leave")
    public ResponseEntity<?> leaveChannel(
            @PathVariable Long channelId,
            Authentication authentication) {
        try {
            log.info("채널 나가기 요청: channelId={}", channelId);

            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "인증이 필요합니다."));
            }

            String currentUserId = getCurrentUserId(authentication);
            channelService.leaveChannel(channelId, currentUserId);

            log.info("채널 나가기 성공: channelId={}", channelId);
            return ResponseEntity.ok(Map.of("message", "채널에서 나갔습니다."));

        } catch (Exception e) {
            log.error("채널 나가기 실패: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "채널 나가기에 실패했습니다."));
        }
    }

    // 🔥 기존 DELETE 메서드도 유지 (하위 호환성)
    @DeleteMapping("/{channelId}/leave")
    public ResponseEntity<?> leaveChannelDelete(
            @PathVariable Long channelId,
            Authentication authentication) {
        return leaveChannel(channelId, authentication);
    }

    // 채널 관리자 이임
    @PutMapping("/{channelId}/transfer")
    public ResponseEntity<?> transferOwnership(
            @PathVariable Long channelId,
            @RequestBody ChannelDTO.TransferOwnershipRequest request,
            Authentication authentication) {
        try {
            log.info("채널 관리자 이임 요청: channelId={}, newOwnerId={}", channelId, request.getNewOwnerId());

            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "인증이 필요합니다."));
            }

            String currentUserId = getCurrentUserId(authentication);
            channelService.transferOwnership(channelId, request, currentUserId);

            log.info("채널 관리자 이임 성공: channelId={}", channelId);
            return ResponseEntity.ok(Map.of("message", "관리자 권한이 이전되었습니다."));

        } catch (Exception e) {
            log.error("채널 관리자 이임 실패: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "관리자 권한 이전에 실패했습니다."));
        }
    }

    // 🔧 안전한 사용자 ID 추출
    // ChannelController.java의 getCurrentUserId 메서드 수정

    // 🔧 안전한 사용자 ID 추출 (User 객체 처리 강화)
    private String getCurrentUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("인증되지 않은 사용자입니다.");
        }

        Object principal = authentication.getPrincipal();
        log.info("🔍 Principal 타입: {}", principal.getClass().getName());

        if (principal instanceof MyUserDetails) {
            MyUserDetails userDetails = (MyUserDetails) principal;
            String userId = userDetails.getUser().getId();
            log.info("✅ MyUserDetails에서 추출한 사용자 ID: {}", userId);
            return userId;
        } else if (principal instanceof String) {
            log.info("✅ String 타입 사용자 ID: {}", principal);
            return (String) principal;
        } else if (principal instanceof User) {
            // 🔥 User 객체인 경우 ID만 추출
            User user = (User) principal;
            String userId = user.getId();
            log.info("✅ User 객체에서 추출한 사용자 ID: {}", userId);
            return userId;
        } else {
            // 🔥 기타 경우: toString()에서 ID 추출 시도
            String principalStr = principal.toString();
            log.info("🔍 Principal toString: {}", principalStr);

            // User 객체의 toString에서 id= 부분 찾기
            if (principalStr.contains("id=")) {
                try {
                    int startIdx = principalStr.indexOf("id=") + 3;
                    int endIdx = principalStr.indexOf(",", startIdx);
                    if (endIdx == -1) endIdx = principalStr.indexOf(")", startIdx);
                    if (endIdx == -1) endIdx = principalStr.indexOf(" ", startIdx);
                    if (endIdx == -1) endIdx = principalStr.length();

                    String userId = principalStr.substring(startIdx, endIdx).trim();
                    log.info("✅ toString에서 추출한 사용자 ID: {}", userId);
                    return userId;
                } catch (Exception e) {
                    log.error("❌ ID 추출 실패: {}", e.getMessage());
                }
            }

            log.warn("⚠️ 알 수 없는 principal 타입, toString 반환: {}", principal.getClass());
            return principal.toString();
        }
    }
}