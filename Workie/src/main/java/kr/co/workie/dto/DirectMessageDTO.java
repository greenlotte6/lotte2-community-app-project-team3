package kr.co.workie.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

public class DirectMessageDTO {

    // DM 시작 요청 DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        private String targetUserId;   // DM을 시작할 상대방 사용자 ID
    }

    // DM 응답 DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String user1Id;
        private String user2Id;
        private String otherUserId;    // 상대방 사용자 ID
        private String otherUserName;  // 상대방 사용자 이름
        private String roomId;         // WebSocket 룸 ID
        private String lastMessage;    // 마지막 메시지
        private LocalDateTime lastMessageAt;
        private LocalDateTime createdAt;
        private boolean isOnline;      // 상대방 온라인 상태 (나중에 WebSocket으로 관리)
    }

    // DM 목록 응답 DTO (간소화된 버전)
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ListResponse {
        private Long id;
        private String otherUserId;    // 상대방 사용자 ID
        private String otherUserName;  // 상대방 사용자 이름
        private String roomId;
        private String lastMessage;
        private LocalDateTime lastMessageAt;
        private boolean isOnline;      // 상대방 온라인 상태
        private int unreadCount;       // 읽지 않은 메시지 수 (나중에 구현)
    }
}