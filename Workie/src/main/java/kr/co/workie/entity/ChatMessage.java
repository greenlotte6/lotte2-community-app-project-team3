package kr.co.workie.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * 채팅 메시지 엔티티
 * 채널과 DM의 모든 메시지를 통합 관리하는 테이블
 */
@Entity
@Table(name = "Chat_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    /**
     * 메시지 고유 ID (기본키)
     * 자동 증가하는 Long 타입 값
     * 프론트엔드에서 key나 메시지 구분용으로 사용
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 메시지 유형
     * CHAT: 일반 채팅 메시지 (사용자가 입력한 텍스트)
     * JOIN: 사용자 입장 알림 메시지 ("홍길동님이 입장했습니다")
     * LEAVE: 사용자 퇴장 알림 메시지 ("홍길동님이 퇴장했습니다")
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageType type;

    /**
     * 메시지 내용
     * TEXT 타입으로 긴 메시지도 저장 가능
     * 일반 채팅: 사용자가 입력한 텍스트
     * 시스템 메시지: "사용자가 입장했습니다" 등의 알림 텍스트
     */
    @Column(columnDefinition = "TEXT")
    private String content;

    /**
     * 메시지 발신자 ID
     * User 엔티티의 ID를 참조하는 문자열
     * 예: "user001", "admin123"
     * 프론트엔드에서 내 메시지인지 판별할 때 사용
     */
    @Column(name = "sender_id", nullable = false)
    private String senderId;

    /**
     * 발신자 표시명
     * 채팅 화면에서 보여질 사용자 이름
     * 예: "홍길동", "김개발자"
     * User 테이블의 name 필드와 별도로 관리 (닉네임 변경 대응)
     */
    @Column(nullable = false)
    private String senderName;

    /**
     * 메시지 생성 시간
     * 메시지가 데이터베이스에 저장된 시간
     * @PrePersist에서 자동으로 현재 시간이 설정됨
     * 프론트엔드에서 "오후 2:30" 형태로 표시
     */
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /**
     * 채팅방 ID
     * 어느 채팅방의 메시지인지 구분하는 식별자
     * 채널: "channel_1", "channel_2" 형태
     * DM: "dm_user1_user2" 형태
     * WebSocket에서 구독할 때도 동일한 ID 사용
     */
    @Column(name = "room_id", nullable = false)
    private String roomId;

    /**
     * 채팅방 유형
     * CHANNEL: 채널 메시지 (다대다 채팅)
     * DM: 다이렉트 메시지 (일대일 채팅)
     * 메시지 조회 시 필터링이나 권한 체크에 사용
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "room_type", nullable = false)
    private RoomType roomType;

    /**
     * 엔티티 생성 시 자동으로 생성 시간을 현재 시간으로 설정
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    /**
     * 메시지 유형 열거형
     */
    public enum MessageType {
        CHAT,    // 일반 채팅 메시지 - 사용자가 직접 입력한 텍스트
        JOIN,    // 사용자 입장 - "홍길동님이 입장했습니다"
        LEAVE    // 사용자 퇴장 - "홍길동님이 퇴장했습니다"
    }

    /**
     * 채팅방 유형 열거형
     */
    public enum RoomType {
        CHANNEL, // 채널 메시지 - 여러 명이 참여하는 공개/비공개 채팅방
        DM       // 다이렉트 메시지 - 두 명만 참여하는 일대일 채팅방
    }
}