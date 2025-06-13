package kr.co.workie.controller;

import kr.co.workie.dto.ChatMessageDTO;
import kr.co.workie.entity.ChatMessage;
import kr.co.workie.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/chat")
public class ChatRestController {

    private final ChatService chatService;

    // 채팅방의 메시지 히스토리 조회
    @GetMapping("/history/{roomId}")
    public ResponseEntity<List<ChatMessageDTO.Response>> getChatHistory(@PathVariable String roomId) {
        try {
            log.info("채팅 히스토리 조회 요청 - 방: {}", roomId);

            List<ChatMessage> messages = chatService.getChatHistory(roomId);

            List<ChatMessageDTO.Response> response = messages.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            log.info("채팅 히스토리 조회 성공 - 방: {}, 메시지 수: {}", roomId, response.size());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("채팅 히스토리 조회 실패 - 방: {}, 오류: {}", roomId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 채팅방의 최근 메시지들 조회
    @GetMapping("/recent/{roomId}")
    public ResponseEntity<List<ChatMessageDTO.Response>> getRecentMessages(
            @PathVariable String roomId,
            @RequestParam(defaultValue = "200") int limit) {

        try {
            log.info("최근 메시지 조회 요청 - 방: {}, 제한: {}", roomId, limit);

            List<ChatMessage> messages = chatService.getRecentMessages(roomId, limit);

            List<ChatMessageDTO.Response> response = messages.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            log.info("최근 메시지 조회 성공 - 방: {}, 메시지 수: {}", roomId, response.size());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("최근 메시지 조회 실패 - 방: {}, 오류: {}", roomId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 메시지 Entity를 Response DTO로 변환
    private ChatMessageDTO.Response convertToResponse(ChatMessage message) {
        return ChatMessageDTO.Response.builder()
                .id(message.getId())
                .content(message.getContent())
                .senderId(message.getSenderId())
                .senderName(message.getSenderName())
                .roomId(message.getRoomId())
                .roomType(message.getRoomType())
                .type(message.getType())
                .createdAt(message.getCreatedAt())
                .build();
    }
}