package kr.co.workie.controller;

import kr.co.workie.dto.UserDTO;  // 🔥 UserDTO import 추가
import kr.co.workie.entity.ChatMessage;
import kr.co.workie.entity.User;
import kr.co.workie.security.MyUserDetails;
import kr.co.workie.service.ChatService;
import kr.co.workie.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Map;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService; // UserService 인터페이스 사용

    @MessageMapping("/chat/{roomId}")
    public void sendMessage(@DestinationVariable String roomId,
                            @Payload Map<String, Object> messageData,
                            Principal principal) {


        log.info("=== WebSocket Principal 상세 분석 ===");
        log.info("Principal: {}", principal);
        log.info("Principal.getName(): {}", principal != null ? principal.getName() : "null");


        try {
            // 🔥 디버깅: 수신된 데이터 전체 로깅
            log.info("=== 메시지 수신 디버깅 ===");
            log.info("방 ID: {}", roomId);
            log.info("메시지 데이터: {}", messageData);
            log.info("Principal: {}", principal);
            log.info("Principal 타입: {}", principal != null ? principal.getClass().getSimpleName() : "null");
            log.info("===============================");

            // 🔥 사용자 정보 추출 - Principal 타입에 따라 처리
            String senderId = "anonymous";
            String senderName = "사용자";

            if (principal != null) {
                // Principal의 실제 타입 확인
                if (principal instanceof UsernamePasswordAuthenticationToken) {
                    UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) principal;
                    Object principalObj = token.getPrincipal();

                    log.info("Authentication Principal 객체: {}", principalObj);
                    log.info("Authentication Principal 타입: {}", principalObj.getClass().getSimpleName());
                    log.info("Token Principal: {}", token.getPrincipal());
                    log.info("Token Details: {}", token.getDetails());
                    log.info("Token Credentials: {}", token.getCredentials());

                    // Principal 객체가 User인 경우
                    if (principalObj instanceof User) {
                        User user = (User) principalObj;
                        senderId = user.getId();  // 🔥 User.getId()만 사용
                        senderName = user.getName() != null ? user.getName() : "익명";
                        log.info("✅ User 객체에서 추출 - ID: {}, 이름: {}", senderId, senderName);
                    }
                    // Principal 객체가 MyUserDetails인 경우
                    else if (principalObj instanceof MyUserDetails) {
                        MyUserDetails userDetails = (MyUserDetails) principalObj;
                        User user = userDetails.getUser();
                        senderId = user.getId();
                        senderName = user.getName() != null ? user.getName() : "익명";
                        log.info("✅ MyUserDetails에서 추출 - ID: {}, 이름: {}", senderId, senderName);
                    }
                    // String인 경우 (username)
                    else if (principalObj instanceof String) {
                        senderId = (String) principalObj;
                        senderName = senderId; // ID를 이름으로 사용
                        log.info("✅ String에서 추출 - ID: {}", senderId);
                    }
                } else {
                    // 다른 타입의 Principal인 경우
                    String principalStr = principal.getName();
                    // User 객체 문자열인지 확인하고 ID만 추출
                    if (principalStr.startsWith("User(id=")) {
                        // "User(id=user3, ..." 에서 "user3" 추출
                        int startIndex = principalStr.indexOf("id=") + 3;
                        int endIndex = principalStr.indexOf(",", startIndex);
                        if (endIndex == -1) endIndex = principalStr.indexOf(")", startIndex);
                        senderId = principalStr.substring(startIndex, endIndex);
                        senderName = senderId;
                        log.info("✅ User 문자열에서 ID 추출: {}", senderId);
                    } else {
                        senderId = principalStr;
                        senderName = senderId;
                        log.info("✅ Principal 이름 사용: {}", senderId);
                    }
                }
            }

            String content = (String) messageData.get("content");
            log.info("처리할 메시지 - 방: {}, 발신자: {} ({}), 내용: {}",
                    roomId, senderName, senderId, content);

            // 🔥 메시지 생성 - 간단한 ID만 사용
            ChatMessage message = ChatMessage.builder()
                    .content(content)
                    .senderId(senderId)        // 🔥 단순 문자열 ID만 저장
                    .senderName(senderName)
                    .roomId(roomId)
                    .type(ChatMessage.MessageType.CHAT)
                    .roomType(determineRoomType(roomId))
                    .build();

            // 메시지 저장
            ChatMessage savedMessage = chatService.saveMessage(message);
            log.info("✅ 메시지 저장 완료 - ID: {}, 발신자: {} ({})",
                    savedMessage.getId(), savedMessage.getSenderName(), savedMessage.getSenderId());

            // 클라이언트로 전송할 메시지 구성
            ChatMessageResponse response = ChatMessageResponse.builder()
                    .id(savedMessage.getId())
                    .content(savedMessage.getContent())
                    .senderId(savedMessage.getSenderId())
                    .senderName(savedMessage.getSenderName())
                    .roomId(savedMessage.getRoomId())
                    .roomType(savedMessage.getRoomType().name())
                    .type(savedMessage.getType().name())
                    .timestamp(savedMessage.getCreatedAt().toString())
                    .build();

            // 브로드캐스트 전 로깅
            log.info("📤 브로드캐스트 시도 - 토픽: /topic/chat/{}, 발신자: {} ({})",
                    roomId, response.getSenderName(), response.getSenderId());

            // 해당 방의 모든 사용자에게 브로드캐스트
            messagingTemplate.convertAndSend("/topic/chat/" + roomId, response);

            log.info("✅ 메시지 브로드캐스트 완료 - 방: {}, 메시지ID: {}", roomId, savedMessage.getId());

        } catch (Exception e) {
            log.error("❌ 메시지 처리 실패 - 방: {}, 오류: {}", roomId, e.getMessage(), e);
        }
    }

    @MessageMapping("/chat/{roomId}/join")
    public void joinRoom(@DestinationVariable String roomId, Principal principal) {
        try {
            // 🔥 동일한 방식으로 사용자 정보 추출
            String userId = "anonymous";
            String userName = "익명";

            if (principal != null) {
                if (principal instanceof UsernamePasswordAuthenticationToken) {
                    UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) principal;
                    Object principalObj = token.getPrincipal();

                    if (principalObj instanceof User) {
                        User user = (User) principalObj;
                        userId = user.getId();  // 🔥 User.getId()만 사용
                        userName = user.getName() != null ? user.getName() : "익명";
                    } else if (principalObj instanceof MyUserDetails) {
                        MyUserDetails userDetails = (MyUserDetails) principalObj;
                        User user = userDetails.getUser();
                        userId = user.getId();
                        userName = user.getName() != null ? user.getName() : "익명";
                    } else if (principalObj instanceof String) {
                        userId = (String) principalObj;
                        userName = userId;
                    }
                } else {
                    String principalStr = principal.getName();
                    if (principalStr.startsWith("User(id=")) {
                        int startIndex = principalStr.indexOf("id=") + 3;
                        int endIndex = principalStr.indexOf(",", startIndex);
                        if (endIndex == -1) endIndex = principalStr.indexOf(")", startIndex);
                        userId = principalStr.substring(startIndex, endIndex);
                        userName = userId;
                    } else {
                        userId = principalStr;
                        userName = userId;
                    }
                }
            }

            log.info("사용자 방 참여 - 사용자: {} ({}), 방: {}", userName, userId, roomId);

            // 참여 알림 메시지 생성
            ChatMessage joinMessage = ChatMessage.builder()
                    .content(userName + "님이 입장했습니다")
                    .senderId(userId)     // 🔥 단순 문자열 ID만 저장
                    .senderName(userName)
                    .roomId(roomId)
                    .type(ChatMessage.MessageType.JOIN)
                    .roomType(determineRoomType(roomId))
                    .build();

            // 참여 메시지 저장 및 브로드캐스트
            ChatMessage savedJoinMessage = chatService.saveMessage(joinMessage);

            ChatMessageResponse response = ChatMessageResponse.builder()
                    .id(savedJoinMessage.getId())
                    .content(savedJoinMessage.getContent())
                    .senderId(savedJoinMessage.getSenderId())
                    .senderName(savedJoinMessage.getSenderName())
                    .roomId(savedJoinMessage.getRoomId())
                    .roomType(savedJoinMessage.getRoomType().name())
                    .type(savedJoinMessage.getType().name())
                    .timestamp(savedJoinMessage.getCreatedAt().toString())
                    .build();

            messagingTemplate.convertAndSend("/topic/chat/" + roomId, response);

        } catch (Exception e) {
            log.error("방 참여 처리 실패 - 방: {}, 오류: {}", roomId, e.getMessage(), e);
        }
    }

    /**
     * 방 ID를 기반으로 방 타입 결정
     */
    private ChatMessage.RoomType determineRoomType(String roomId) {
        if (roomId.startsWith("channel_")) {
            return ChatMessage.RoomType.CHANNEL;
        } else if (roomId.startsWith("dm_")) {
            return ChatMessage.RoomType.DM;
        } else {
            return ChatMessage.RoomType.CHANNEL; // 기본값
        }
    }

    /**
     * 클라이언트로 전송할 메시지 응답 클래스
     */
    @lombok.Builder
    @lombok.Data
    public static class ChatMessageResponse {
        private Long id;
        private String content;
        private String senderId;
        private String senderName;
        private String roomId;
        private String roomType;
        private String type;
        private String timestamp;
    }
}