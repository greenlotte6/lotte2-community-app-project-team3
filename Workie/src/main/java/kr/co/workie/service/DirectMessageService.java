package kr.co.workie.service;

import kr.co.workie.dto.DirectMessageDTO;
import kr.co.workie.dto.UserDTO;
import kr.co.workie.entity.DirectMessage;
import kr.co.workie.repository.DirectMessageRepository;
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
public class DirectMessageService {

    private final DirectMessageRepository directMessageRepository;
    private final UserService userService;

    // 현재 로그인된 사용자 정보 가져오기
    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails userDetails = (MyUserDetails) auth.getPrincipal();
        return userDetails.getUser().getId();
    }

    // DM 시작하기
    @Transactional
    public DirectMessageDTO.Response startDirectMessage(DirectMessageDTO.CreateRequest request) {
        String currentUserId = getCurrentUserId();
        String targetUserId = request.getTargetUserId();

        log.info("DM 시작 요청 - 발신자: {}, 수신자: {}", currentUserId, targetUserId);

        // 자기 자신과 DM 방지
        if (currentUserId.equals(targetUserId)) {
            throw new RuntimeException("자기 자신과는 DM을 할 수 없습니다.");
        }

        // 대상 사용자 존재 확인
        UserDTO targetUser = userService.getUserById(targetUserId);

        // 이미 DM이 존재하는지 확인
        if (directMessageRepository.existsByTwoUsers(currentUserId, targetUserId)) {
            log.info("이미 존재하는 DM - 기존 DM 반환");
            DirectMessage existingDM = directMessageRepository.findByTwoUsers(currentUserId, targetUserId)
                    .orElseThrow(() -> new RuntimeException("DM 조회 실패"));
            return convertToResponse(existingDM);
        }

        // 새 DM 생성
        DirectMessage directMessage = DirectMessage.builder()
                .user1Id(currentUserId)
                .user2Id(targetUserId)
                .build(); // roomId는 @PrePersist에서 자동 생성

        DirectMessage savedDM = directMessageRepository.save(directMessage);
        log.info("새 DM 생성 완료 - ID: {}, roomId: {}", savedDM.getId(), savedDM.getRoomId());

        return convertToResponse(savedDM);
    }

    // 사용자의 DM 목록 조회
    @Transactional(readOnly = true)
    public List<DirectMessageDTO.ListResponse> getUserDirectMessages() {
        String currentUserId = getCurrentUserId();

        log.info("DM 목록 조회 - 사용자: {}", currentUserId);

        List<DirectMessage> directMessages = directMessageRepository.findByUserId(currentUserId);

        return directMessages.stream()
                .map(dm -> convertToListResponse(dm, currentUserId))
                .collect(Collectors.toList());
    }

    // DM 상세 정보 조회
    @Transactional(readOnly = true)
    public DirectMessageDTO.Response getDirectMessageById(Long dmId) {
        String currentUserId = getCurrentUserId();

        DirectMessage directMessage = directMessageRepository.findById(dmId)
                .orElseThrow(() -> new RuntimeException("DM을 찾을 수 없습니다."));

        // 권한 확인 (DM 참여자인지)
        if (!directMessage.isParticipant(currentUserId)) {
            throw new RuntimeException("해당 DM에 접근할 권한이 없습니다.");
        }

        return convertToResponse(directMessage);
    }

    // DM 삭제 (실제로는 해당 사용자에게만 숨김)
    @Transactional
    public void deleteDirectMessage(Long dmId) {
        String currentUserId = getCurrentUserId();

        DirectMessage directMessage = directMessageRepository.findById(dmId)
                .orElseThrow(() -> new RuntimeException("DM을 찾을 수 없습니다."));

        // 권한 확인
        if (!directMessage.isParticipant(currentUserId)) {
            throw new RuntimeException("해당 DM에 접근할 권한이 없습니다.");
        }

        // 실제 삭제 (양쪽 사용자 모두 삭제하는 경우)
        directMessageRepository.delete(directMessage);

        log.info("DM 삭제 완료 - ID: {}, 사용자: {}", dmId, currentUserId);
    }

    // roomId로 DM 조회
    @Transactional(readOnly = true)
    public DirectMessageDTO.Response getDirectMessageByRoomId(String roomId) {
        String currentUserId = getCurrentUserId();

        DirectMessage directMessage = directMessageRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException("DM을 찾을 수 없습니다."));

        // 권한 확인
        if (!directMessage.isParticipant(currentUserId)) {
            throw new RuntimeException("해당 DM에 접근할 권한이 없습니다.");
        }

        return convertToResponse(directMessage);
    }

    // Entity를 Response DTO로 변환
    private DirectMessageDTO.Response convertToResponse(DirectMessage dm) {
        String currentUserId = getCurrentUserId();
        String otherUserId = dm.getOtherUserId(currentUserId);

        // 상대방 사용자 정보 조회
        UserDTO otherUser = userService.getUserById(otherUserId);

        return DirectMessageDTO.Response.builder()
                .id(dm.getId())
                .user1Id(dm.getUser1Id())
                .user2Id(dm.getUser2Id())
                .otherUserId(otherUserId)
                .otherUserName(otherUser.getName())
                .roomId(dm.getRoomId())
                .lastMessage(dm.getLastMessage())
                .lastMessageAt(dm.getLastMessageAt())
                .createdAt(dm.getCreatedAt())
                .isOnline(false) // TODO: WebSocket 연동 시 실제 온라인 상태로 변경
                .build();
    }

    // Entity를 ListResponse DTO로 변환
    private DirectMessageDTO.ListResponse convertToListResponse(DirectMessage dm, String currentUserId) {
        String otherUserId = dm.getOtherUserId(currentUserId);

        // 상대방 사용자 정보 조회
        UserDTO otherUser = userService.getUserById(otherUserId);

        return DirectMessageDTO.ListResponse.builder()
                .id(dm.getId())
                .otherUserId(otherUserId)
                .otherUserName(otherUser.getName())
                .roomId(dm.getRoomId())
                .lastMessage(dm.getLastMessage())
                .lastMessageAt(dm.getLastMessageAt())
                .isOnline(false) // TODO: WebSocket 연동 시 실제 온라인 상태로 변경
                .unreadCount(0) // TODO: 읽지 않은 메시지 수 기능 구현
                .build();
    }
}