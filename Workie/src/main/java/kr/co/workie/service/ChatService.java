package kr.co.workie.service;

import kr.co.workie.entity.ChatMessage;
import kr.co.workie.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;  // 🔥 추가

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;

    /**
     * 채팅 메시지 저장
     */
    public ChatMessage saveMessage(ChatMessage message) {
        log.info("채팅 메시지 저장: {}", message.getContent());
        return chatMessageRepository.save(message);
    }

    /**
     * 특정 채팅방의 메시지 히스토리 조회
     */
    @Transactional(readOnly = true)
    public List<ChatMessage> getChatHistory(String roomId) {
        return chatMessageRepository.findByRoomIdOrderByCreatedAtAsc(roomId);
    }

    /**
     * 특정 채팅방의 최근 메시지들 조회
     */
    @Transactional(readOnly = true)
    public List<ChatMessage> getRecentMessages(String roomId, int limit) {
        // int limit를 Pageable로 변환
        Pageable pageable = PageRequest.of(0, limit);
        List<ChatMessage> messages = chatMessageRepository.findRecentMessagesByRoomId(roomId, pageable);

        // 🔥 최신 50개를 가져온 후 오래된 순으로 정렬
        return messages.stream()
                .sorted((a, b) -> a.getCreatedAt().compareTo(b.getCreatedAt()))
                .collect(Collectors.toList());
    }

    /**
     * 사용자별 메시지 조회
     */
    @Transactional(readOnly = true)
    public List<ChatMessage> getMessagesBySender(String senderId) {
        return chatMessageRepository.findBySenderIdOrderByCreatedAtDesc(senderId);
    }
}