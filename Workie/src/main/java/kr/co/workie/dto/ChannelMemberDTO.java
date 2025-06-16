package kr.co.workie.dto;

import kr.co.workie.entity.ChannelMember;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

public class ChannelMemberDTO {

    // 멤버 추가 요청 DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AddRequest {
        private String userId;         // 추가할 사용자 ID
        private String role;           // 권한 (MEMBER, ADMIN) - OWNER는 채널 생성자만
    }

    // 멤버 정보 응답 DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private Long channelId;
        private String userId;
        private String userName;       // 사용자 이름
        private String userEmployeeId; // 사번
        private String userDepartment; // 부서
        private String userPosition;   // 직책
        private ChannelMember.MemberRole role;
        private LocalDateTime joinedAt;
        private boolean isOnline;      // 온라인 상태
    }

    // 멤버 목록용 간소화 DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ListResponse {
        private String userId;
        private String userName;
        private String userEmployeeId;
        private String userDepartment;
        private ChannelMember.MemberRole role;
        private boolean isOnline;
    }

    // 추가 가능한 사용자 DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AvailableUser {
        private String id;
        private String name;
        private String employeeId;
        private String department;
        private String position;
        private String email;
        private boolean isOnline;
    }

    // 멤버 권한 변경 요청 DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRoleRequest {
        private String userId;
        private ChannelMember.MemberRole newRole;
    }

    // 🔥 여기에 추가하세요!
    // 권한 정보 응답 DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoleResponse {
        private ChannelMember.MemberRole role;  // 현재 권한
        private boolean isAdmin;                 // OWNER 또는 ADMIN인지
        private boolean canAddMembers;           // 멤버 추가 권한
        private boolean canRemoveMembers;        // 멤버 제거 권한
        private boolean canChangeRoles;          // 권한 변경 권한 (OWNER만)
    }
}