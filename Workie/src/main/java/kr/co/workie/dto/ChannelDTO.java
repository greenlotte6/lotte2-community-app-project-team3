package kr.co.workie.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

public class ChannelDTO {

    // 채널 생성 요청 DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        private String name;           // 채널명
        private List<String> memberIds; // 추가할 멤버 ID 목록
    }

    // 채널 응답 DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String name;
        private String ownerId;
        private String ownerName;      // 소유자 이름 (조인해서 가져오거나 별도 조회)
        private int memberCount;       // 멤버 수
        private List<MemberInfo> members; // 멤버 목록
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private String roomId;         // WebSocket 룸 ID (channel_${id})
    }

    // 멤버 정보 DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MemberInfo {
        private String userId;
        private String userName;
        private String role;           // OWNER, ADMIN, MEMBER
        private LocalDateTime joinedAt;
        private boolean isOnline;      // 온라인 상태 (나중에 WebSocket으로 관리)
    }

    // 🔥 채널 목록 응답 DTO (수정된 버전)
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ListResponse {
        private Long id;
        private String name;
        private int memberCount;
        private String lastMessage;    // 마지막 메시지 (선택사항)
        private LocalDateTime lastMessageAt;
        private boolean isOwner;       // 현재 사용자가 소유자인지
        private String ownerId;        // 🔥 채널 소유자 ID 추가!
        private String roomId;
    }

    // 채널 관리자 이임 요청 DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransferOwnershipRequest {
        private String newOwnerId;     // 새로운 소유자 ID
    }

    // 멤버 추가 요청 DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddMemberRequest {
        private List<String> memberIds; // 추가할 멤버 ID 목록
    }
}