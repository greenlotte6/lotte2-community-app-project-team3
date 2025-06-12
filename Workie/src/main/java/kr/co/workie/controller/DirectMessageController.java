package kr.co.workie.controller;

import kr.co.workie.dto.DirectMessageDTO;
import kr.co.workie.service.DirectMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/dm")
public class DirectMessageController {

    private final DirectMessageService directMessageService;

    // DM 시작하기
    @PostMapping
    public ResponseEntity<DirectMessageDTO.Response> startDirectMessage(@RequestBody DirectMessageDTO.CreateRequest request) {
        try {
            log.info("DM 시작 요청: targetUserId={}", request.getTargetUserId());
            DirectMessageDTO.Response response = directMessageService.startDirectMessage(request);
            log.info("DM 시작 성공: dmId={}, roomId={}", response.getId(), response.getRoomId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("DM 시작 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 사용자의 DM 목록 조회
    @GetMapping
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

    // DM 상세 정보 조회
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

    // roomId로 DM 조회 (WebSocket용)
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
}