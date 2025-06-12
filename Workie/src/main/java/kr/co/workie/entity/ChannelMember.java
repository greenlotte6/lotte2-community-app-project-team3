package kr.co.workie.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * 채널 멤버 엔티티
 * 채널에 속한 사용자들의 정보와 권한을 관리하는 테이블
 */
@Entity
@Table(name = "channel_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChannelMember {

    /**
     * 채널 멤버 고유 ID (기본키)
     * 자동 증가하는 Long 타입 값
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 채널 정보 (외래키)
     * 어떤 채널에 속한 멤버인지를 나타냄
     * 지연 로딩으로 성능 최적화
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "channel_id", nullable = false)
    private Channel channel;

    /**
     * 사용자 ID
     * User 엔티티의 ID를 참조하는 문자열
     * 예: "user001", "admin123" 등
     */
    @Column(name = "user_id", nullable = false)
    private String userId;

    /**
     * 채널 가입 일시
     * 사용자가 해당 채널에 처음 가입한 시간을 기록
     * @PrePersist에서 자동으로 현재 시간이 설정됨
     */
    @Column(name = "joined_at")
    private LocalDateTime joinedAt;

    /**
     * 채널 내 멤버 권한
     * OWNER: 채널 개설자 (채널 삭제, 관리자 임명 가능)
     * ADMIN: 관리자 (멤버 추방, 채널 설정 변경 가능)
     * MEMBER: 일반 멤버 (기본값, 채팅만 가능)
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private MemberRole role = MemberRole.MEMBER;

    /**
     * 엔티티 생성 시 자동으로 가입 시간을 현재 시간으로 설정
     */
    @PrePersist
    protected void onCreate() {
        this.joinedAt = LocalDateTime.now();
    }

    /**
     * 채널 멤버 권한 열거형
     */
    public enum MemberRole {
        OWNER,   // 채널 개설자 - 모든 권한
        ADMIN,   // 관리자 - 멤버 관리 권한
        MEMBER   // 일반 멤버 - 채팅 권한만
    }
}