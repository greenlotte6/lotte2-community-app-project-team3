package kr.co.workie.service;

import kr.co.workie.dto.ChannelMemberDTO;
import kr.co.workie.dto.UserDTO;
import kr.co.workie.entity.Channel;
import kr.co.workie.entity.ChannelMember;
import kr.co.workie.repository.ChannelMemberRepository;
import kr.co.workie.repository.ChannelRepository;
import kr.co.workie.security.MyUserDetails;
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
public class ChannelMemberService {

    private final ChannelMemberRepository channelMemberRepository;
    private final ChannelRepository channelRepository;
    private final UserService userService;

    // 현재 로그인된 사용자 정보 가져오기
    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails userDetails = (MyUserDetails) auth.getPrincipal();
        return userDetails.getUser().getId();
    }

    // 채널에 멤버 추가
    @Transactional
    public ChannelMemberDTO.Response addMemberToChannel(Long channelId, ChannelMemberDTO.AddRequest request) {
        String currentUserId = getCurrentUserId();
        String targetUserId = request.getUserId();

        log.info("채널 멤버 추가 요청 - 채널: {}, 대상사용자: {}, 요청자: {}", channelId, targetUserId, currentUserId);

        // 채널 존재 확인
        Channel channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new RuntimeException("채널을 찾을 수 없습니다."));

        // 권한 확인 (OWNER 또는 ADMIN만 가능)
        if (!isUserAdminOfChannel(channelId, currentUserId)) {
            throw new RuntimeException("멤버를 추가할 권한이 없습니다.");
        }

        // 대상 사용자 존재 확인
        UserDTO targetUser = userService.getUserById(targetUserId);

        // 이미 멤버인지 확인
        if (channelMemberRepository.existsByChannelIdAndUserId(channelId, targetUserId)) {
            throw new RuntimeException("이미 채널 멤버입니다.");
        }

        // 권한 설정 (기본값: MEMBER)
        ChannelMember.MemberRole role = ChannelMember.MemberRole.MEMBER;
        if ("ADMIN".equalsIgnoreCase(request.getRole())) {
            role = ChannelMember.MemberRole.ADMIN;
        }

        // 멤버 추가
        ChannelMember newMember = ChannelMember.builder()
                .channel(channel)
                .userId(targetUserId)
                .role(role)
                .build();

        ChannelMember savedMember = channelMemberRepository.save(newMember);
        log.info("채널 멤버 추가 완료 - ID: {}", savedMember.getId());

        return convertToResponse(savedMember);
    }

    // 채널 멤버 목록 조회
    @Transactional(readOnly = true)
    public List<ChannelMemberDTO.Response> getChannelMembers(Long channelId) {
        String currentUserId = getCurrentUserId();

        log.info("채널 멤버 목록 조회 - 채널: {}, 요청자: {}", channelId, currentUserId);

        // 채널 멤버인지 확인
        if (!channelMemberRepository.existsByChannelIdAndUserId(channelId, currentUserId)) {
            throw new RuntimeException("채널 멤버만 멤버 목록을 조회할 수 있습니다.");
        }

        List<ChannelMember> members = channelMemberRepository.findByChannelId(channelId);

        return members.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // 추가 가능한 사용자 목록 조회
    @Transactional(readOnly = true)
    public List<ChannelMemberDTO.AvailableUser> getAvailableUsers(Long channelId) {
        String currentUserId = getCurrentUserId();

        // 권한 확인
        if (!isUserAdminOfChannel(channelId, currentUserId)) {
            throw new RuntimeException("멤버를 조회할 권한이 없습니다.");
        }

        // 현재 채널에 속하지 않은 사용자들 조회
        List<String> currentMemberIds = channelMemberRepository.findByChannelId(channelId)
                .stream()
                .map(ChannelMember::getUserId)
                .collect(Collectors.toList());

        // 전체 사용자에서 현재 멤버들 제외
        List<UserDTO> allUsers = userService.getAllActiveUsers(); // UserService에 이 메서드 추가 필요

        return allUsers.stream()
                .filter(user -> !currentMemberIds.contains(user.getId()))
                .map(user -> ChannelMemberDTO.AvailableUser.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .employeeId(user.getEmployeeId())
                        .department(user.getDepartment())
                        .position(user.getPosition())
                        .email(user.getEmail())
                        .isOnline(false) // TODO: 온라인 상태 연동
                        .build())
                .collect(Collectors.toList());
    }

    // 채널에서 멤버 제거
    @Transactional
    public void removeMemberFromChannel(Long channelId, String targetUserId) {
        String currentUserId = getCurrentUserId();

        log.info("채널 멤버 제거 요청 - 채널: {}, 대상사용자: {}, 요청자: {}", channelId, targetUserId, currentUserId);

        // 권한 확인
        if (!isUserAdminOfChannel(channelId, currentUserId)) {
            throw new RuntimeException("멤버를 제거할 권한이 없습니다.");
        }

        // 대상 멤버 존재 확인
        ChannelMember targetMember = channelMemberRepository.findByChannelIdAndUserId(channelId, targetUserId)
                .orElseThrow(() -> new RuntimeException("해당 사용자는 채널 멤버가 아닙니다."));

        // OWNER는 제거할 수 없음
        if (targetMember.getRole() == ChannelMember.MemberRole.OWNER) {
            throw new RuntimeException("채널 소유자는 제거할 수 없습니다.");
        }

        channelMemberRepository.delete(targetMember);
        log.info("채널 멤버 제거 완료 - 사용자: {}", targetUserId);
    }

    // 멤버 권한 변경
    @Transactional
    public ChannelMemberDTO.Response updateMemberRole(Long channelId, ChannelMemberDTO.UpdateRoleRequest request) {
        String currentUserId = getCurrentUserId();

        // OWNER만 권한 변경 가능
        ChannelMember currentMember = channelMemberRepository.findByChannelIdAndUserId(channelId, currentUserId)
                .orElseThrow(() -> new RuntimeException("채널 멤버가 아닙니다."));

        if (currentMember.getRole() != ChannelMember.MemberRole.OWNER) {
            throw new RuntimeException("채널 소유자만 권한을 변경할 수 있습니다.");
        }

        // 대상 멤버 조회
        ChannelMember targetMember = channelMemberRepository.findByChannelIdAndUserId(channelId, request.getUserId())
                .orElseThrow(() -> new RuntimeException("해당 사용자는 채널 멤버가 아닙니다."));

        // OWNER 권한은 변경할 수 없음
        if (targetMember.getRole() == ChannelMember.MemberRole.OWNER ||
                request.getNewRole() == ChannelMember.MemberRole.OWNER) {
            throw new RuntimeException("소유자 권한은 변경할 수 없습니다.");
        }

        targetMember.setRole(request.getNewRole());
        ChannelMember updatedMember = channelMemberRepository.save(targetMember);

        log.info("멤버 권한 변경 완료 - 사용자: {}, 새 권한: {}", request.getUserId(), request.getNewRole());

        return convertToResponse(updatedMember);
    }

    // 사용자가 채널의 관리자(OWNER/ADMIN)인지 확인
    public boolean isUserAdminOfChannel(Long channelId, String userId) {
        return channelMemberRepository.findByChannelIdAndUserId(channelId, userId)
                .map(member -> member.getRole() == ChannelMember.MemberRole.OWNER ||
                        member.getRole() == ChannelMember.MemberRole.ADMIN)
                .orElse(false);
    }

    // Entity를 Response DTO로 변환
    private ChannelMemberDTO.Response convertToResponse(ChannelMember member) {
        UserDTO user = userService.getUserById(member.getUserId());

        return ChannelMemberDTO.Response.builder()
                .id(member.getId())
                .channelId(member.getChannel().getId())
                .userId(member.getUserId())
                .userName(user != null ? user.getName() : "알 수 없는 사용자")
                .userEmployeeId(user != null ? user.getEmployeeId() : "")
                .userDepartment(user != null ? user.getDepartment() : "")
                .userPosition(user != null ? user.getPosition() : "")
                .role(member.getRole())
                .joinedAt(member.getJoinedAt())
                .isOnline(false) // TODO: 온라인 상태 연동
                .build();
    }


    // 🔥 기존 convertToResponse 메서드 아래에 추가하세요!

    /**
     * 특정 멤버 정보 조회
     */
    @Transactional(readOnly = true)
    public ChannelMemberDTO.Response getChannelMember(Long channelId, String userId) {
        String currentUserId = getCurrentUserId();

        // 채널 멤버인지 확인 (멤버만 다른 멤버 정보 조회 가능)
        if (!channelMemberRepository.existsByChannelIdAndUserId(channelId, currentUserId)) {
            throw new RuntimeException("채널 멤버만 멤버 정보를 조회할 수 있습니다.");
        }

        ChannelMember member = channelMemberRepository.findByChannelIdAndUserId(channelId, userId)
                .orElseThrow(() -> new RuntimeException("채널 멤버를 찾을 수 없습니다."));

        return convertToResponse(member);
    }

    /**
     * 내가 관리자인 채널 목록 조회
     */
    @Transactional(readOnly = true)
    public List<ChannelMemberDTO.Response> getMyAdminChannels() {
        String currentUserId = getCurrentUserId();

        // OWNER인 채널들 조회
        List<ChannelMember> ownerChannels = channelMemberRepository.findByUserIdAndRole(
                currentUserId, ChannelMember.MemberRole.OWNER);

        // ADMIN인 채널들 조회
        List<ChannelMember> adminChannels = channelMemberRepository.findByUserIdAndRole(
                currentUserId, ChannelMember.MemberRole.ADMIN);

        // 두 리스트 합치기
        ownerChannels.addAll(adminChannels);

        return ownerChannels.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * 채널 멤버 수 조회
     */
    @Transactional(readOnly = true)
    public long getChannelMemberCount(Long channelId) {
        // 채널 존재 확인
        if (!channelRepository.existsById(channelId)) {
            throw new RuntimeException("채널을 찾을 수 없습니다.");
        }

        return channelMemberRepository.countByChannelId(channelId);
    }

    /**
     * 현재 사용자의 채널 내 권한 조회
     */
    @Transactional(readOnly = true)
    public ChannelMemberDTO.RoleResponse getMyRoleInChannel(Long channelId) {
        String currentUserId = getCurrentUserId();

        ChannelMember member = channelMemberRepository.findByChannelIdAndUserId(channelId, currentUserId)
                .orElseThrow(() -> new RuntimeException("채널 멤버가 아닙니다."));

        boolean isAdmin = member.getRole() == ChannelMember.MemberRole.OWNER ||
                member.getRole() == ChannelMember.MemberRole.ADMIN;

        return ChannelMemberDTO.RoleResponse.builder()
                .role(member.getRole())
                .isAdmin(isAdmin)
                .canAddMembers(isAdmin)
                .canRemoveMembers(isAdmin)
                .canChangeRoles(member.getRole() == ChannelMember.MemberRole.OWNER)
                .build();
    }


}