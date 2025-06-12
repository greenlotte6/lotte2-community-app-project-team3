package kr.co.workie.service;

import kr.co.workie.dto.ChannelDTO;
import kr.co.workie.entity.Channel;
import kr.co.workie.entity.ChannelMember;
import kr.co.workie.repository.ChannelRepository;
import kr.co.workie.repository.ChannelMemberRepository;
import kr.co.workie.security.MyUserDetails;
import kr.co.workie.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class ChannelService {

    private final ChannelRepository channelRepository;
    private final ChannelMemberRepository channelMemberRepository;
    private final UserService userService; // UserRepository 대신 UserService 사용

    // 현재 로그인된 사용자 정보 가져오기
    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails userDetails = (MyUserDetails) auth.getPrincipal();
        return userDetails.getUser().getId();
    }

    // 채널 생성
    @Transactional
    public ChannelDTO.Response createChannel(ChannelDTO.CreateRequest request) {
        String currentUserId = getCurrentUserId();

        // 채널 생성
        Channel channel = Channel.builder()
                .name(request.getName())
                .ownerId(currentUserId)
                .build();

        Channel savedChannel = channelRepository.save(channel);

        // 채널 개설자를 OWNER로 추가
        ChannelMember ownerMember = ChannelMember.builder()
                .channel(savedChannel)
                .userId(currentUserId)
                .role(ChannelMember.MemberRole.OWNER)
                .build();

        channelMemberRepository.save(ownerMember);

        // 요청된 멤버들을 MEMBER로 추가
        if (request.getMemberIds() != null && !request.getMemberIds().isEmpty()) {
            for (String memberId : request.getMemberIds()) {
                // 중복 방지 (이미 소유자로 추가됨)
                if (!memberId.equals(currentUserId)) {
                    ChannelMember member = ChannelMember.builder()
                            .channel(savedChannel)
                            .userId(memberId)
                            .role(ChannelMember.MemberRole.MEMBER)
                            .build();
                    channelMemberRepository.save(member);
                }
            }
        }

        return convertToChannelResponse(savedChannel);
    }

    // 사용자가 참여한 채널 목록 조회 (임시로 단순하게)
    public List<ChannelDTO.ListResponse> getUserChannels() {
        String currentUserId = getCurrentUserId();

        // 임시로 모든 채널을 가져온 후 필터링 (나중에 최적화)
        List<Channel> allChannels = channelRepository.findAll();

        return allChannels.stream()
                .filter(channel -> channel.getOwnerId().equals(currentUserId)) // 일단 소유자인 채널만
                .map(this::convertToChannelListResponse)
                .collect(Collectors.toList());
    }

    // 채널 상세 정보 조회 (임시로 단순하게)
    public ChannelDTO.Response getChannelById(Long channelId) {
        String currentUserId = getCurrentUserId();

        Channel channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new RuntimeException("채널을 찾을 수 없습니다."));

        // 임시로 권한 체크 스킵 (나중에 추가)
        return convertToChannelResponse(channel);
    }

    // 채널 나가기
    @Transactional
    public void leaveChannel(Long channelId) {
        String currentUserId = getCurrentUserId();

        ChannelMember member = channelMemberRepository.findByChannelIdAndUserId(channelId, currentUserId)
                .orElseThrow(() -> new RuntimeException("채널 멤버가 아닙니다."));

        // 소유자인 경우 관리자 이임
        if (member.getRole() == ChannelMember.MemberRole.OWNER) {
            transferOwnershipBeforeLeave(channelId);
        }

        // 멤버십 삭제
        channelMemberRepository.deleteByChannelIdAndUserId(channelId, currentUserId);

        log.info("사용자 {}가 채널 {}에서 나갔습니다.", currentUserId, channelId);
    }

    // 관리자 이임 후 나가기
    @Transactional
    private void transferOwnershipBeforeLeave(Long channelId) {
        List<ChannelMember> nonOwners = channelMemberRepository.findNonOwnersByChannelIdOrderByJoinedAt(channelId);

        if (!nonOwners.isEmpty()) {
            // 가장 오래된 멤버에게 소유권 이임
            ChannelMember newOwner = nonOwners.get(0);
            newOwner.setRole(ChannelMember.MemberRole.OWNER);
            channelMemberRepository.save(newOwner);

            // 채널의 ownerId도 업데이트
            Channel channel = channelRepository.findById(channelId)
                    .orElseThrow(() -> new RuntimeException("채널을 찾을 수 없습니다."));
            channel.setOwnerId(newOwner.getUserId());
            channelRepository.save(channel);

            log.info("채널 {} 소유권이 {}에게 이임되었습니다.", channelId, newOwner.getUserId());
        }
    }

    // 관리자 이임 (수동)
    @Transactional
    public void transferOwnership(Long channelId, ChannelDTO.TransferOwnershipRequest request) {
        String currentUserId = getCurrentUserId();

        // 현재 사용자가 소유자인지 확인
        ChannelMember currentOwner = channelMemberRepository.findByChannelIdAndUserId(channelId, currentUserId)
                .orElseThrow(() -> new RuntimeException("채널 멤버가 아닙니다."));

        if (currentOwner.getRole() != ChannelMember.MemberRole.OWNER) {
            throw new RuntimeException("채널 소유자만 관리자를 이임할 수 있습니다.");
        }

        // 새로운 소유자가 채널 멤버인지 확인
        ChannelMember newOwner = channelMemberRepository.findByChannelIdAndUserId(channelId, request.getNewOwnerId())
                .orElseThrow(() -> new RuntimeException("새로운 소유자가 채널 멤버가 아닙니다."));

        // 소유권 이임
        currentOwner.setRole(ChannelMember.MemberRole.MEMBER);
        newOwner.setRole(ChannelMember.MemberRole.OWNER);

        channelMemberRepository.save(currentOwner);
        channelMemberRepository.save(newOwner);

        // 채널의 ownerId 업데이트
        Channel channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new RuntimeException("채널을 찾을 수 없습니다."));
        channel.setOwnerId(request.getNewOwnerId());
        channelRepository.save(channel);

        log.info("채널 {} 소유권이 {}에서 {}로 이임되었습니다.", channelId, currentUserId, request.getNewOwnerId());
    }

    // Entity를 DTO로 변환 (단순화)
    private ChannelDTO.Response convertToChannelResponse(Channel channel) {
        String currentUserId = getCurrentUserId();

        // 멤버 정보 조회 (임시로 빈 리스트)
        List<ChannelDTO.MemberInfo> memberInfos = List.of();

        // 소유자 이름 조회
        UserDTO owner = userService.getUserById(channel.getOwnerId());
        String ownerName = owner.getName();

        return ChannelDTO.Response.builder()
                .id(channel.getId())
                .name(channel.getName())
                .ownerId(channel.getOwnerId())
                .ownerName(ownerName)
                .memberCount(0) // 임시로 0
                .members(memberInfos)
                .createdAt(channel.getCreatedAt())
                .updatedAt(channel.getUpdatedAt())
                .roomId("channel_" + channel.getId())
                .build();
    }

    private ChannelDTO.ListResponse convertToChannelListResponse(Channel channel) {
        String currentUserId = getCurrentUserId();

        return ChannelDTO.ListResponse.builder()
                .id(channel.getId())
                .name(channel.getName())
                .memberCount(0) // 임시로 0
                .isOwner(channel.getOwnerId().equals(currentUserId))
                .roomId("channel_" + channel.getId())
                .build();
    }
}