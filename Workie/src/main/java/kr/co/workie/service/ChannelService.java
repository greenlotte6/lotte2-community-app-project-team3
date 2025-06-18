package kr.co.workie.service;

import kr.co.workie.dto.ChannelDTO;
import kr.co.workie.entity.Channel;
import kr.co.workie.entity.ChannelMember;
import kr.co.workie.entity.User;
import kr.co.workie.repository.ChannelRepository;
import kr.co.workie.repository.ChannelMemberRepository;
import kr.co.workie.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class ChannelService {

    private final ChannelRepository channelRepository;
    private final ChannelMemberRepository channelMemberRepository;
    private final UserRepository userRepository;

    /**
     * 🎯 채널 생성 (기존 Entity 구조 사용)
     */
    public ChannelDTO.Response createChannel(ChannelDTO.CreateRequest request, String currentUserId) {
        log.info("🚀 채널 생성 시작: name={}, creator={}, memberIds={}",
                request.getName(), currentUserId, request.getMemberIds());

        try {
            // 1. 입력 유효성 검사
            validateChannelRequest(request);

            // 2. 현재 사용자 확인
            User creator = userRepository.findById(currentUserId)
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + currentUserId));
            log.info("✅ 생성자 확인: {} ({})", creator.getId(), creator.getName());

            // 3. 채널 생성 (기존 Entity 구조 사용)
            Channel channel = Channel.builder()
                    .name(request.getName().trim())
                    .ownerId(currentUserId)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            Channel savedChannel = channelRepository.save(channel);
            log.info("✅ 채널 DB 저장 완료: {} (ID: {})", savedChannel.getName(), savedChannel.getId());

            // 4. 🔥 생성자를 자동으로 OWNER로 추가 (기존 Entity 관계 활용)
            ChannelMember creatorMember = ChannelMember.builder()
                    .channel(savedChannel)  // 🔥 기존 구조: Channel 객체 직접 참조
                    .userId(currentUserId)
                    .role(ChannelMember.MemberRole.OWNER)  // 🔥 기존 구조: Enum 사용
                    .joinedAt(LocalDateTime.now())
                    .build();

            // 🔥 기존 Entity의 편의 메서드 활용
            savedChannel.addMember(creatorMember);
            channelMemberRepository.save(creatorMember);
            log.info("✅ 생성자 {} OWNER로 추가 완료", currentUserId);

            // 5. 요청된 멤버들 추가
            int totalMembers = 1; // 생성자
            if (request.getMemberIds() != null && !request.getMemberIds().isEmpty()) {
                log.info("👥 추가 멤버 처리 시작: {}", request.getMemberIds());

                for (String memberId : request.getMemberIds()) {
                    if (memberId != null && !memberId.trim().isEmpty() && !memberId.equals(currentUserId)) {
                        try {
                            // 사용자 존재 확인
                            User member = userRepository.findById(memberId.trim())
                                    .orElseThrow(() -> new IllegalArgumentException("멤버를 찾을 수 없습니다: " + memberId));

                            // 중복 멤버 체크 (기존 Repository 메서드 활용)
                            if (!channelMemberRepository.existsByChannelIdAndUserId(savedChannel.getId(), memberId.trim())) {
                                ChannelMember channelMember = ChannelMember.builder()
                                        .channel(savedChannel)  // 🔥 Channel 객체 참조
                                        .userId(memberId.trim())
                                        .role(ChannelMember.MemberRole.MEMBER)  // 🔥 Enum 사용
                                        .joinedAt(LocalDateTime.now())
                                        .build();

                                // 🔥 편의 메서드 활용
                                savedChannel.addMember(channelMember);
                                channelMemberRepository.save(channelMember);
                                totalMembers++;
                                log.info("✅ 멤버 {} ({}) 추가 완료", memberId, member.getName());
                            } else {
                                log.warn("⚠️ 멤버 {}는 이미 채널에 있음", memberId);
                            }

                        } catch (Exception e) {
                            log.error("❌ 멤버 {} 추가 실패: {}", memberId, e.getMessage());
                            // 멤버 추가 실패해도 채널 생성은 계속 진행
                        }
                    }
                }
            }

            // 6. 최종 결과 확인 (기존 Repository 메서드 활용)
            long actualMemberCount = channelMemberRepository.countByChannelId(savedChannel.getId());
            log.info("✅ 채널 생성 완료 - 예상 멤버: {}, 실제 멤버: {}", totalMembers, actualMemberCount);

            // 7. 멤버별 역할 현황 출력 (디버깅용)
            List<Object[]> memberStats = channelMemberRepository.countMembersByRoleAndChannelId(savedChannel.getId());
            memberStats.forEach(stat ->
                    log.info("  📊 역할 {}: {}명", stat[0], stat[1]));

            return ChannelDTO.Response.builder()
                    .id(savedChannel.getId())
                    .name(savedChannel.getName())
                    .ownerId(savedChannel.getOwnerId())
                    .ownerName(creator.getName())  // 🔥 생성자 이름 추가
                    .memberCount((int) actualMemberCount)
                    .createdAt(savedChannel.getCreatedAt())
                    .updatedAt(savedChannel.getUpdatedAt())
                    .roomId("channel_" + savedChannel.getId()) // WebSocket용
                    .build();

        } catch (Exception e) {
            log.error("❌ 채널 생성 실패: {}", e.getMessage(), e);
            throw new RuntimeException("채널 생성에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 🎯 사용자가 참여한 채널 목록 조회 (기존 Repository 쿼리 활용)
     */
    @Transactional(readOnly = true)
    public List<ChannelDTO.ListResponse> getUserChannels(String userId) {
        log.info("📋 사용자 {}의 채널 목록 조회", userId);

        try {
            // 🔥 기존 Repository의 최적화된 쿼리 활용
            List<Channel> userChannels = channelRepository.findChannelsByUserIdString(userId);

            List<ChannelDTO.ListResponse> channels = userChannels.stream()
                    .map(channel -> {
                        // 각 채널의 멤버 수 조회 (기존 Repository 메서드)
                        long memberCount = channelMemberRepository.countByChannelId(channel.getId());

                        // 사용자가 소유자인지 확인 (기존 Repository 메서드)
                        boolean isOwner = channelMemberRepository.isOwnerOfChannel(channel.getId(), userId);

                        // 사용자의 역할 조회
                        ChannelMember userMembership = channelMemberRepository
                                .findByChannelIdAndUserId(channel.getId(), userId)
                                .orElse(null);

                        String userRole = userMembership != null ?
                                userMembership.getRole().name() : "UNKNOWN";

                        return ChannelDTO.ListResponse.builder()
                                .id(channel.getId())
                                .name(channel.getName())
                                .memberCount((int) memberCount)
                                .isOwner(isOwner)
                                .ownerId(channel.getOwnerId())
                                .lastMessage("최근 메시지...") // 실제로는 메시지 테이블에서 조회
                                .lastMessageAt(channel.getUpdatedAt()) // 채널 마지막 업데이트 시간 사용
                                .roomId("channel_" + channel.getId())
                                .build();
                    })
                    .collect(Collectors.toList());

            log.info("✅ 채널 목록 조회 완료: {}개", channels.size());

            // 디버깅용 로그
            channels.forEach(channel ->
                    log.info("  - {} (ID: {}, 멤버: {}명, 소유자: {})",
                            channel.getName(), channel.getId(), channel.getMemberCount(), channel.isOwner()));

            return channels;

        } catch (Exception e) {
            log.error("❌ 사용자 {} 채널 목록 조회 실패: {}", userId, e.getMessage(), e);
            throw new RuntimeException("채널 목록 조회에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 채널 상세 정보 조회 (기존 Repository 메서드 활용)
     */
    @Transactional(readOnly = true)
    public ChannelDTO.Response getChannelById(Long channelId, String currentUserId) {
        log.info("🔍 채널 {} 상세 조회 (사용자: {})", channelId, currentUserId);

        // 🔥 기존 Repository의 fetch join 쿼리 활용 (N+1 문제 해결)
        Channel channel = channelRepository.findByIdWithMembers(channelId)
                .orElseThrow(() -> new IllegalArgumentException("채널을 찾을 수 없습니다: " + channelId));

        // 사용자가 해당 채널의 멤버인지 확인 (기존 Repository 메서드)
        if (!channelRepository.existsByChannelIdAndUserId(channelId, currentUserId)) {
            throw new IllegalArgumentException("채널에 접근할 권한이 없습니다.");
        }

        // 소유자 정보 조회
        User owner = userRepository.findById(channel.getOwnerId())
                .orElse(null);
        String ownerName = owner != null ? owner.getName() : "알 수 없음";

        // 멤버 수 (이미 fetch join으로 가져온 데이터 활용)
        int memberCount = channel.getMembers().size();

        // 멤버 정보 생성
        List<ChannelDTO.MemberInfo> memberInfos = channel.getMembers().stream()
                .map(member -> {
                    User memberUser = userRepository.findById(member.getUserId()).orElse(null);
                    return ChannelDTO.MemberInfo.builder()
                            .userId(member.getUserId())
                            .userName(memberUser != null ? memberUser.getName() : "알 수 없음")
                            .role(member.getRole().name())
                            .joinedAt(member.getJoinedAt())
                            .isOnline(true) // 실제로는 온라인 상태 서비스에서 조회
                            .build();
                })
                .collect(Collectors.toList());

        return ChannelDTO.Response.builder()
                .id(channel.getId())
                .name(channel.getName())
                .ownerId(channel.getOwnerId())
                .ownerName(ownerName)
                .memberCount(memberCount)
                .members(memberInfos)
                .createdAt(channel.getCreatedAt())
                .updatedAt(channel.getUpdatedAt())
                .roomId("channel_" + channel.getId())
                .build();
    }

    /**
     * 채널 나가기 (기존 Repository 메서드 활용)
     */
    public void leaveChannel(Long channelId, String currentUserId) {
        log.info("🚪 채널 {} 나가기: {}", channelId, currentUserId);

        Channel channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new IllegalArgumentException("채널을 찾을 수 없습니다."));

        // 소유자는 나갈 수 없음 (기존 Repository 메서드로 확인)
//        if (channelMemberRepository.isOwnerOfChannel(channelId, currentUserId)) {
//            throw new IllegalArgumentException("채널 소유자는 나갈 수 없습니다. 소유권을 먼저 이전해주세요.");
//        }

        // 멤버십 제거 (기존 Repository 메서드)
        channelMemberRepository.deleteByChannelIdAndUserId(channelId, currentUserId);

        log.info("✅ 채널 나가기 완료: channelId={}, userId={}", channelId, currentUserId);
    }

    /**
     * 소유권 이전 (기존 Repository 메서드 활용)
     */
    public void transferOwnership(Long channelId, ChannelDTO.TransferOwnershipRequest request, String currentUserId) {
        log.info("👑 소유권 이전: channelId={}, from={}, to={}", channelId, currentUserId, request.getNewOwnerId());

        Channel channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new IllegalArgumentException("채널을 찾을 수 없습니다."));

        // 현재 사용자가 소유자인지 확인 (기존 Repository 메서드)
        if (!channelMemberRepository.isOwnerOfChannel(channelId, currentUserId)) {
            throw new IllegalArgumentException("채널 소유자만 소유권을 이전할 수 있습니다.");
        }

        // 새 소유자가 멤버인지 확인 (기존 Repository 메서드)
        if (!channelMemberRepository.existsByChannelIdAndUserId(channelId, request.getNewOwnerId())) {
            throw new IllegalArgumentException("새 소유자는 채널 멤버여야 합니다.");
        }

        // 소유권 이전
        channel.setOwnerId(request.getNewOwnerId());
        channel.setUpdatedAt(LocalDateTime.now());
        channelRepository.save(channel);

        // 기존 소유자를 MEMBER로 변경
        ChannelMember oldOwner = channelMemberRepository
                .findByChannelIdAndUserId(channelId, currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("기존 소유자 멤버십을 찾을 수 없습니다."));
        oldOwner.setRole(ChannelMember.MemberRole.MEMBER);
        channelMemberRepository.save(oldOwner);

        // 새 소유자를 OWNER로 변경
        ChannelMember newOwner = channelMemberRepository
                .findByChannelIdAndUserId(channelId, request.getNewOwnerId())
                .orElseThrow(() -> new IllegalArgumentException("새 소유자 멤버십을 찾을 수 없습니다."));
        newOwner.setRole(ChannelMember.MemberRole.OWNER);
        channelMemberRepository.save(newOwner);

        log.info("✅ 소유권 이전 완료: channelId={}", channelId);
    }

    /**
     * 입력 유효성 검사
     */
    private void validateChannelRequest(ChannelDTO.CreateRequest request) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("채널명은 필수입니다.");
        }

        String name = request.getName().trim();
        if (name.length() < 2) {
            throw new IllegalArgumentException("채널명은 2자 이상이어야 합니다.");
        }

        if (name.length() > 100) {  // 🔥 기존 Entity의 length=100에 맞춤
            throw new IllegalArgumentException("채널명은 100자 이하여야 합니다.");
        }

        // 중복 채널명 확인 - 기존 Repository에는 이 메서드가 없으므로 직접 구현
        List<Channel> existingChannels = channelRepository.findByNameContainingIgnoreCase(name);
        boolean duplicateExists = existingChannels.stream()
                .anyMatch(channel -> channel.getName().equalsIgnoreCase(name));

        if (duplicateExists) {
            throw new IllegalArgumentException("이미 존재하는 채널명입니다: " + name);
        }
    }

    /**
     * 🔧 디버깅용 메서드 - 현재 DB 상태 확인
     */
    @Transactional(readOnly = true)
    public void debugChannelStatus() {
        log.info("🔍 현재 DB 채널 상태:");

        List<Channel> allChannels = channelRepository.findAll();
        log.info("  전체 채널 수: {}", allChannels.size());

        allChannels.forEach(channel -> {
            long memberCount = channelMemberRepository.countByChannelId(channel.getId());
            log.info("    - {} (ID: {}, 소유자: {}, 멤버: {}명)",
                    channel.getName(), channel.getId(), channel.getOwnerId(), memberCount);
        });

        log.info("  사용자별 채널 참여 현황:");
        List<ChannelMember> allMembers = channelMemberRepository.findAll();
        allMembers.stream()
                .collect(Collectors.groupingBy(ChannelMember::getUserId))
                .forEach((userId, memberships) ->
                        log.info("    - {}: {} 개 채널 참여", userId, memberships.size()));
    }
}