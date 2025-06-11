package kr.co.workie.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "direct_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DirectMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user1_id", nullable = false)
    private Long user1Id; // 첫 번째 사용자 ID

    @Column(name = "user2_id", nullable = false)
    private Long user2Id; // 두 번째 사용자 ID

    @Column(name = "room_id", nullable = false, unique = true)
    private String roomId; // WebSocket 룸 ID (예: "dm_1_2")

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "last_message")
    private String lastMessage; // 마지막 메시지 (선택사항)

    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt; // 마지막 메시지 시간

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        // DM roomId 자동 생성 (작은 ID가 앞에 오도록)
        if (this.roomId == null) {
            Long smallerId = Math.min(user1Id, user2Id);
            Long largerId = Math.max(user1Id, user2Id);
            this.roomId = "dm_" + smallerId + "_" + largerId;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // 편의 메서드: 상대방 ID 가져오기
    public Long getOtherUserId(Long currentUserId) {
        return currentUserId.equals(user1Id) ? user2Id : user1Id;
    }

    // 편의 메서드: 해당 사용자가 이 DM의 참여자인지 확인
    public boolean isParticipant(Long userId) {
        return userId.equals(user1Id) || userId.equals(user2Id);
    }
}