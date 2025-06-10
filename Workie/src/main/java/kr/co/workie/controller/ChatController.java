package kr.co.workie.controller;

import kr.co.workie.entity.ChatMessage;
import kr.co.workie.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.List;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;

    /**
     * 채팅 메시지 전송 (WebSocket)
     * 클라이언트: /app/chat.sendMessage/{roomId}로 메시지 전송
     * 구독자들: /topic/{roomId}에서 메시지 수신
     */
    @MessageMapping("/chat.sendMessage/{roomId}")
    @SendTo("/topic/{roomId}")
    public ChatMessage sendMessage(@DestinationVariable String roomId, ChatMessage chatMessage) {
        log.info("메시지 전송 - 방: {}, 발신자: {}", roomId, chatMessage.getSender());

        // 채팅방 ID 설정
        chatMessage.setRoomId(roomId);
        chatMessage.setType(ChatMessage.MessageType.CHAT);

        // 데이터베이스에 저장
        ChatMessage savedMessage = chatService.saveMessage(chatMessage);

        return savedMessage;
    }

    /**
     * 사용자 입장 알림 (WebSocket)
     */
    @MessageMapping("/chat.addUser/{roomId}")
    @SendTo("/topic/{roomId}")
    public ChatMessage addUser(@DestinationVariable String roomId, ChatMessage chatMessage) {
        log.info("사용자 입장 - 방: {}, 사용자: {}", roomId, chatMessage.getSender());

        chatMessage.setRoomId(roomId);
        chatMessage.setType(ChatMessage.MessageType.JOIN);
        chatMessage.setContent(chatMessage.getSender() + "님이 입장했습니다.");

        // 입장 메시지도 저장
        ChatMessage savedMessage = chatService.saveMessage(chatMessage);

        return savedMessage;
    }

    /**
     * 채팅방 히스토리 조회 (REST API)
     */
    @GetMapping("/api/chat/history/{roomId}")
    @ResponseBody
    public List<ChatMessage> getChatHistory(@PathVariable String roomId) {
        return chatService.getChatHistory(roomId);
    }

    /**
     * 최근 메시지 조회 (REST API)
     */
    @GetMapping("/api/chat/recent/{roomId}/{limit}")
    @ResponseBody
    public List<ChatMessage> getRecentMessages(@PathVariable String roomId, @PathVariable int limit) {
        return chatService.getRecentMessages(roomId, limit);
    }
}