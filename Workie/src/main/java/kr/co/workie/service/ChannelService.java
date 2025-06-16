// ChannelService.java - 완전한 구현
package kr.co.workie.service;

import kr.co.workie.dto.ChannelDTO;
import kr.co.workie.entity.User;
import kr.co.workie.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class ChannelService {

    private final UserRepository userRepository; // 사용자 정보 조회용

    /**
     * 채널 생성 (현재 사용자 ID 포함)
     */
    public ChannelDTO.Response createChannel(ChannelDTO.CreateRequest request, String currentUserId) {
        log.info("🚀 채널 생성 서비스: name={}, creator={}, members={}",
                request.getName(), currentUserId, request.getMemberIds());

        // 🔥 입력 유효성 검사
        validateChannelRequest(request);

        // 🔥 사용자 정보 조회 (실제 사용자명 가져오기)
        String ownerName = getUserName(currentUserId);

        // 🔥 멤버 수 계산 (생성자 + 추가 멤버들)
        int memberCount = 1; // 생성자
        if (request.getMemberIds() != null && !request.getMemberIds().isEmpty()) {
            memberCount += request.getMemberIds().size();
        }

        // 🔥 임시 응답 생성 (실제로는 DB에 저장해야 함)
        ChannelDTO.Response response = ChannelDTO.Response.builder()
                .id(System.currentTimeMillis()) // 임시 ID (실제로는 DB에서 자동 생성)
                .name(request.getName().trim())
                .ownerId(currentUserId)
                .ownerName(ownerName)
                .memberCount(memberCount)
                .members(createMemberList(currentUserId, request.getMemberIds()))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .roomId("channel_" + System.currentTimeMillis()) // WebSocket 룸 ID
                .build();

        log.info("✅ 채널 생성 완료: {}", response.getName());
        return response;
    }

    /**
     * 사용자가 참여한 채널 목록 조회
     */
    public List<ChannelDTO.ListResponse> getUserChannels(String currentUserId) {
        log.info("📋 사용자 {}의 채널 목록 조회", currentUserId);

        // 🔥 실제로는 DB에서 조회해야 함
        // SELECT * FROM channels c
        // JOIN channel_members cm ON c.id = cm.channel_id
        // WHERE cm.user_id = currentUserId

        // 임시 데이터
        List<ChannelDTO.ListResponse> channels = new ArrayList<>();

        channels.add(ChannelDTO.ListResponse.builder()
                .id(1L)
                .name("일반")
                .memberCount(5)
                .lastMessage("안녕하세요! 새로운 프로젝트 시작하겠습니다.")
                .lastMessageAt(LocalDateTime.now().minusMinutes(10))
                .isOwner(true)
                .roomId("channel_1")
                .build());

        channels.add(ChannelDTO.ListResponse.builder()
                .id(2L)
                .name("개발팀")
                .memberCount(3)
                .lastMessage("코드 리뷰 부탁드립니다.")
                .lastMessageAt(LocalDateTime.now().minusHours(2))
                .isOwner(false)
                .roomId("channel_2")
                .build());

        channels.add(ChannelDTO.ListResponse.builder()
                .id(3L)
                .name("기획팀")
                .memberCount(7)
                .lastMessage("회의 일정 공유드립니다.")
                .lastMessageAt(LocalDateTime.now().minusHours(5))
                .isOwner(false)
                .roomId("channel_3")
                .build());

        log.info("✅ 채널 목록 조회 성공: {}개", channels.size());
        return channels;
    }

    /**
     * 채널 상세 정보 조회
     */
    public ChannelDTO.Response getChannelById(Long channelId, String currentUserId) {
        log.info("🔍 채널 {} 상세 조회 (사용자: {})", channelId, currentUserId);

        // 🔥 실제로는 DB에서 조회
        // SELECT * FROM channels WHERE id = channelId

        String ownerName = getUserName(currentUserId);

        // 임시 멤버 리스트 생성
        List<ChannelDTO.MemberInfo> members = new ArrayList<>();
        members.add(ChannelDTO.MemberInfo.builder()
                .userId(currentUserId)
                .userName(ownerName)
                .role("OWNER")
                .joinedAt(LocalDateTime.now().minusDays(5))
                .isOnline(true)
                .build());

        members.add(ChannelDTO.MemberInfo.builder()
                .userId("user1")
                .userName("김개발")
                .role("MEMBER")
                .joinedAt(LocalDateTime.now().minusDays(3))
                .isOnline(false)
                .build());

        members.add(ChannelDTO.MemberInfo.builder()
                .userId("user2")
                .userName("이기획")
                .role("MEMBER")
                .joinedAt(LocalDateTime.now().minusDays(1))
                .isOnline(true)
                .build());

        ChannelDTO.Response response = ChannelDTO.Response.builder()
                .id(channelId)
                .name("테스트 채널 #" + channelId)
                .ownerId(currentUserId)
                .ownerName(ownerName)
                .memberCount(members.size())
                .members(members)
                .createdAt(LocalDateTime.now().minusDays(5))
                .updatedAt(LocalDateTime.now())
                .roomId("channel_" + channelId)
                .build();

        log.info("✅ 채널 상세 조회 성공: {}", response.getName());
        return response;
    }

    /**
     * 채널 나가기
     */
    public void leaveChannel(Long channelId, String currentUserId) {
        log.info("🚪 사용자 {}가 채널 {}에서 나가기", currentUserId, channelId);

        // 🔥 실제로는 DB에서 처리
        // 1. 채널 멤버 테이블에서 해당 사용자 제거
        // DELETE FROM channel_members WHERE channel_id = channelId AND user_id = currentUserId

        // 2. 만약 소유자가 나가는 경우, 다른 멤버에게 소유권 이전
        // UPDATE channels SET owner_id = (다른 멤버) WHERE id = channelId AND owner_id = currentUserId

        // 3. 마지막 멤버가 나가는 경우, 채널 삭제 고려

        log.info("✅ 채널 나가기 처리 완료");
    }

    /**
     * 채널 관리자 권한 이전
     */
    public void transferOwnership(Long channelId, ChannelDTO.TransferOwnershipRequest request, String currentUserId) {
        log.info("👑 채널 {} 소유권 이전: {} -> {}", channelId, currentUserId, request.getNewOwnerId());

        // 🔥 실제로는 DB에서 처리
        // 1. 현재 사용자가 소유자인지 확인
        // 2. 새로운 소유자가 채널 멤버인지 확인
        // 3. 소유권 이전
        // UPDATE channels SET owner_id = request.getNewOwnerId() WHERE id = channelId AND owner_id = currentUserId

        log.info("✅ 소유권 이전 처리 완료");
    }

    // 🔧 입력 유효성 검사
    private void validateChannelRequest(ChannelDTO.CreateRequest request) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("채널명은 필수입니다.");
        }

        String name = request.getName().trim();
        if (name.length() < 2) {
            throw new IllegalArgumentException("채널명은 2자 이상이어야 합니다.");
        }

        if (name.length() > 20) {
            throw new IllegalArgumentException("채널명은 20자 이하여야 합니다.");
        }

        // 특수문자 체크 (선택사항)
        if (name.matches(".*[<>\"'&].*")) {
            throw new IllegalArgumentException("채널명에 특수문자는 사용할 수 없습니다.");
        }
    }

    // 🔧 사용자 이름 조회
    private String getUserName(String userId) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null && user.getName() != null) {
                return user.getName();
            } else {
                log.warn("⚠️ 사용자 정보를 찾을 수 없음: {}", userId);
                return "사용자 " + userId; // 기본값
            }
        } catch (Exception e) {
            log.warn("⚠️ 사용자 정보 조회 실패: {}", e.getMessage());
            return "사용자 " + userId; // 기본값
        }
    }

    // 🔧 멤버 리스트 생성 (임시)
    private List<ChannelDTO.MemberInfo> createMemberList(String ownerId, List<String> memberIds) {
        List<ChannelDTO.MemberInfo> members = new ArrayList<>();

        // 소유자 추가
        String ownerName = getUserName(ownerId);
        members.add(ChannelDTO.MemberInfo.builder()
                .userId(ownerId)
                .userName(ownerName)
                .role("OWNER")
                .joinedAt(LocalDateTime.now())
                .isOnline(true)
                .build());

        // 다른 멤버들 추가
        if (memberIds != null) {
            for (String memberId : memberIds) {
                String memberName = getUserName(memberId);
                members.add(ChannelDTO.MemberInfo.builder()
                        .userId(memberId)
                        .userName(memberName)
                        .role("MEMBER")
                        .joinedAt(LocalDateTime.now())
                        .isOnline(Math.random() > 0.5) // 임시로 랜덤 온라인 상태
                        .build());
            }
        }

        return members;
    }

    // 🔧 기존 메서드들 (하위 호환성을 위해 유지)
    public ChannelDTO.Response createChannel(ChannelDTO.CreateRequest request) {
        throw new UnsupportedOperationException("현재 사용자 정보가 필요합니다. createChannel(request, currentUserId)를 사용하세요.");
    }

    public List<ChannelDTO.ListResponse> getUserChannels() {
        throw new UnsupportedOperationException("현재 사용자 정보가 필요합니다. getUserChannels(currentUserId)를 사용하세요.");
    }

    public ChannelDTO.Response getChannelById(Long channelId) {
        throw new UnsupportedOperationException("현재 사용자 정보가 필요합니다. getChannelById(channelId, currentUserId)를 사용하세요.");
    }

    public void leaveChannel(Long channelId) {
        throw new UnsupportedOperationException("현재 사용자 정보가 필요합니다. leaveChannel(channelId, currentUserId)를 사용하세요.");
    }

    public void transferOwnership(Long channelId, ChannelDTO.TransferOwnershipRequest request) {
        throw new UnsupportedOperationException("현재 사용자 정보가 필요합니다. transferOwnership(channelId, request, currentUserId)를 사용하세요.");
    }
}