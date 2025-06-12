package kr.co.workie.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * 다이렉트 메시지 방 엔티티
 * 두 사용자 간의 일대일 채팅방 정보를 관리하는 테이블
 * 실제 메시지 내용은 ChatMessage 테이블에 저장됨
 */
@Entity
@Table(name = "direct_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DirectMessage {

    /**
     * DM 방 고유 ID (기본키)
     * 자동 증가하는 Long 타입 값
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 첫 번째 참여자 사용자 ID
     * User 엔티티의 ID를 참조하는 문자열
     * 예: "user001"
     * user1Id와 user2Id는 순서가 없음 (어느 쪽이든 가능)
     */
    @Column(name = "user1_id", nullable = false)
    private String user1Id;

    /**
     * 두 번째 참여자 사용자 ID
     * User 엔티티의 ID를 참조하는 문자열
     * 예: "user002"
     * user1Id와 user2Id는 순서가 없음 (어느 쪽이든 가능)
     */
    @Column(name = "user2_id", nullable = false)
    private String user2Id;

    /**
     * WebSocket 채팅방 ID
     * 고유한 문자열로 두 사용자 간의 채팅방을 식별
     * 자동 생성: "dm_작은ID_큰ID" 형태 (예: "dm_user001_user002")
     * 순서를 정렬해서 생성하므로 동일한 두 사용자는 항상 같은 roomId
     * WebSocket 구독과 ChatMessage의 roomId에서 동일하게 사용
     */
    @Column(name = "room_id", nullable = false, unique = true)
    private String roomId;

    /**
     * DM 방 생성 일시
     * 두 사용자가 처음 대화를 시작한 시간
     * @PrePersist에서 자동으로 현재 시간이 설정됨
     */
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /**
     * DM 방 정보 마지막 업데이트 시간
     * 새 메시지가 올 때마다 갱신됨
     * @PreUpdate에서 자동으로 현재 시간이 설정됨
     * DM 목록 정렬 시 최근 대화 순으로 표시할 때 사용
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * 마지막 메시지 내용 (선택사항)
     * DM 목록에서 미리보기로 표시할 마지막 메시지
     * 예: "안녕하세요!", "내일 회의 시간 어떻게 되나요?"
     * 성능상 이유로 별도 저장 (매번 ChatMessage 조회 방지)
     */
    @Column(name = "last_message")
    private String lastMessage;

    /**
     * 마지막 메시지 전송 시간
     * 가장 최근에 주고받은 메시지의 시간
     * DM 목록 정렬과 "3분 전", "어제" 등의 표시에 사용
     */
    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;

    /**
     * 엔티티 생성 시 자동 처리
     * 1. 생성/수정 시간을 현재 시간으로 설정
     * 2. roomId가 없으면 자동 생성 (문자열 정렬 기준)
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();

        // DM roomId 자동 생성 (사용자 ID를 사전순으로 정렬)
        if (this.roomId == null) {
            String smallerId = user1Id.compareTo(user2Id) < 0 ? user1Id : user2Id;
            String largerId = user1Id.compareTo(user2Id) < 0 ? user2Id : user1Id;
            this.roomId = "dm_" + smallerId + "_" + largerId;
        }
    }

    /**
     * 엔티티 업데이트 시 수정 시간을 현재 시간으로 자동 갱신
     * 새 메시지가 올 때마다 호출됨
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * 편의 메서드: 상대방 사용자 ID 가져오기
     * @param currentUserId 현재 로그인한 사용자 ID
     * @return 상대방 사용자 ID
     *
     * 사용 예시:
     * String otherId = directMessage.getOtherUserId("user001");
     * // user001이 user1Id면 user2Id 반환, user2Id면 user1Id 반환
     */
    public String getOtherUserId(String currentUserId) {
        return currentUserId.equals(user1Id) ? user2Id : user1Id;
    }

    /**
     * 편의 메서드: 해당 사용자가 이 DM의 참여자인지 확인
     * @param userId 확인할 사용자 ID
     * @return 참여자이면 true, 아니면 false
     *
     * 사용 예시:
     * boolean canAccess = directMessage.isParticipant("user001");
     * // 권한 체크나 메시지 조회 시 사용
     */
    public boolean isParticipant(String userId) {
        return userId.equals(user1Id) || userId.equals(user2Id);
    }
}