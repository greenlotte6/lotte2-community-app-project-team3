package kr.co.workie.controller;

import kr.co.workie.dto.ChatMessageDTO;
import kr.co.workie.entity.ChatMessage;
import kr.co.workie.service.ChatService;
import kr.co.workie.service.UserService;
import kr.co.workie.security.MyUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Slf4j
@RequiredArgsConstructor
@Controller
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;
    private final UserService userService;

    // 채팅 메시지 전송 처리
    @MessageMapping("/chat/{roomId}")
    public void sendMessage(
            @DestinationVariable String roomId,
            @Payload ChatMessageDTO.WebSocketMessage message,
            SimpMessageHeaderAccessor headerAccessor) {

        try {
            // 현재 사용자 정보 가져오기
            String currentUserId = getCurrentUserId();
            String currentUserName = getCurrentUserName();

            log.info("메시지 수신 - 방: {}, 발신자: {}, 내용: {}", roomId, currentUserId, message.getContent());

            // 메시지 정보 설정
            message.setSenderId(currentUserId);
            message.setSenderName(currentUserName);
            message.setRoomId(roomId);
            message.setTimestamp(LocalDateTime.now());

            // 룸 타입 결정 (roomId 패턴으로 판단)
            ChatMessage.RoomType roomType = roomId.startsWith("channel_") ?
                    ChatMessage.RoomType.CHANNEL : ChatMessage.RoomType.DM;
            message.setRoomType(roomType);

            // 메시지 타입이 없으면 기본값 설정
            if (message.getType() == null) {
                message.setType(ChatMessage.MessageType.CHAT);
            }

            // 데이터베이스에 저장
            ChatMessage chatMessage = ChatMessage.builder()
                    .senderId(currentUserId)
                    .senderName(currentUserName)
                    .content(message.getContent())
                    .roomId(roomId)
                    .roomType(roomType)
                    .type(message.getType())
                    .build();

            ChatMessage savedMessage = chatService.saveMessage(chatMessage);
            log.info("메시지 저장 완료 - ID: {}", savedMessage.getId());

            // 응답 메시지 생성
            ChatMessageDTO.WebSocketMessage responseMessage = ChatMessageDTO.WebSocketMessage.builder()
                    .content(savedMessage.getContent())
                    .senderId(savedMessage.getSenderId())
                    .senderName(savedMessage.getSenderName())
                    .roomId(savedMessage.getRoomId())
                    .roomType(savedMessage.getRoomType())
                    .type(savedMessage.getType())
                    .timestamp(savedMessage.getCreatedAt())
                    .build();

            // 해당 룸을 구독한 모든 클라이언트에게 메시지 전송
            messagingTemplate.convertAndSend("/topic/chat/" + roomId, responseMessage);

            log.info("메시지 브로드캐스트 완료 - 방: {}", roomId);

        } catch (Exception e) {
            log.error("메시지 처리 실패 - 방: {}, 오류: {}", roomId, e.getMessage(), e);
        }
    }

    // 사용자 입장 처리
    @MessageMapping("/chat/{roomId}/join")
    public void joinRoom(
            @DestinationVariable String roomId,
            SimpMessageHeaderAccessor headerAccessor) {

        try {
            String currentUserId = getCurrentUserId();
            String currentUserName = getCurrentUserName();

            log.info("사용자 입장 - 방: {}, 사용자: {}", roomId, currentUserId);

            // 입장 메시지 생성
            ChatMessage.RoomType roomType = roomId.startsWith("channel_") ?
                    ChatMessage.RoomType.CHANNEL : ChatMessage.RoomType.DM;

            // 입장 메시지 저장
            ChatMessage joinMessage = ChatMessage.builder()
                    .senderId(currentUserId)
                    .senderName(currentUserName)
                    .content(currentUserName + "님이 입장했습니다.")
                    .roomId(roomId)
                    .roomType(roomType)
                    .type(ChatMessage.MessageType.JOIN)
                    .build();

            ChatMessage savedMessage = chatService.saveMessage(joinMessage);

            // 입장 알림 전송
            ChatMessageDTO.WebSocketMessage joinNotification = ChatMessageDTO.WebSocketMessage.builder()
                    .content(savedMessage.getContent())
                    .senderId(savedMessage.getSenderId())
                    .senderName(savedMessage.getSenderName())
                    .roomId(savedMessage.getRoomId())
                    .roomType(savedMessage.getRoomType())
                    .type(savedMessage.getType())
                    .timestamp(savedMessage.getCreatedAt())
                    .build();

            messagingTemplate.convertAndSend("/topic/chat/" + roomId, joinNotification);

        } catch (Exception e) {
            log.error("입장 처리 실패 - 방: {}, 오류: {}", roomId, e.getMessage(), e);
        }
    }

    // 사용자 퇴장 처리
    @MessageMapping("/chat/{roomId}/leave")
    public void leaveRoom(
            @DestinationVariable String roomId,
            SimpMessageHeaderAccessor headerAccessor) {

        try {
            String currentUserId = getCurrentUserId();
            String currentUserName = getCurrentUserName();

            log.info("사용자 퇴장 - 방: {}, 사용자: {}", roomId, currentUserId);

            // 퇴장 메시지 생성
            ChatMessage.RoomType roomType = roomId.startsWith("channel_") ?
                    ChatMessage.RoomType.CHANNEL : ChatMessage.RoomType.DM;

            // 퇴장 메시지 저장
            ChatMessage leaveMessage = ChatMessage.builder()
                    .senderId(currentUserId)
                    .senderName(currentUserName)
                    .content(currentUserName + "님이 퇴장했습니다.")
                    .roomId(roomId)
                    .roomType(roomType)
                    .type(ChatMessage.MessageType.LEAVE)
                    .build();

            ChatMessage savedMessage = chatService.saveMessage(leaveMessage);

            // 퇴장 알림 전송
            ChatMessageDTO.WebSocketMessage leaveNotification = ChatMessageDTO.WebSocketMessage.builder()
                    .content(savedMessage.getContent())
                    .senderId(savedMessage.getSenderId())
                    .senderName(savedMessage.getSenderName())
                    .roomId(savedMessage.getRoomId())
                    .roomType(savedMessage.getRoomType())
                    .type(savedMessage.getType())
                    .timestamp(savedMessage.getCreatedAt())
                    .build();

            messagingTemplate.convertAndSend("/topic/chat/" + roomId, leaveNotification);

        } catch (Exception e) {
            log.error("퇴장 처리 실패 - 방: {}, 오류: {}", roomId, e.getMessage(), e);
        }
    }

    // 현재 사용자 ID 가져오기
    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof MyUserDetails) {
            MyUserDetails userDetails = (MyUserDetails) auth.getPrincipal();
            return userDetails.getUser().getId();
        }
        return "anonymous";
    }

    // 현재 사용자 이름 가져오기
    private String getCurrentUserName() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof MyUserDetails) {
            MyUserDetails userDetails = (MyUserDetails) auth.getPrincipal();
            return userDetails.getUser().getName();
        }
        return "익명";
    }
}