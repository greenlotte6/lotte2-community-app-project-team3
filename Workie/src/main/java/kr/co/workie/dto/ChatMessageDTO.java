package kr.co.workie.dto;

import kr.co.workie.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

public class ChatMessageDTO {

    // 메시지 전송 요청 DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SendRequest {
        private String content;        // 메시지 내용
        private String roomId;         // 채팅방 ID
        private ChatMessage.RoomType roomType; // CHANNEL 또는 DM
        private ChatMessage.MessageType type;  // CHAT, JOIN, LEAVE
    }

    // 메시지 응답 DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String content;
        private String senderId;
        private String senderName;
        private String roomId;
        private ChatMessage.RoomType roomType;
        private ChatMessage.MessageType type;
        private LocalDateTime createdAt;
    }

    // WebSocket용 메시지 DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WebSocketMessage {
        private String content;
        private String senderId;
        private String senderName;
        private String roomId;
        private ChatMessage.RoomType roomType;
        private ChatMessage.MessageType type;
        private LocalDateTime timestamp;
    }
}