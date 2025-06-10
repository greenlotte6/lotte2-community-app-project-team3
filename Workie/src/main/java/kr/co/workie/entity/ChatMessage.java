package kr.co.workie.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 아이디

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageType type; // 메시지 종류 (채팅 메세지인지 입장/퇴장 같은 시스템 메시지 인지

    @Column(columnDefinition = "TEXT")
    private String content;   // 메세지 내용

    @Column(nullable = false)
    private String sender; // 메시지를 보낸 사용자

    @Column(name = "created_at")
    private LocalDateTime createdAt; // 메시지가 db에 저장된 정확한 시간

    @Column(name = "room_id")
    private String roomId; // 채팅방 구분용

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum MessageType {
        CHAT,    // 일반 채팅 메시지
        JOIN,    // 사용자 입장
        LEAVE    // 사용자 퇴장
    }
}