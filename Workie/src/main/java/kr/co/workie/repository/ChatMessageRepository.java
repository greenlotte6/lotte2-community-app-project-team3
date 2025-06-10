package kr.co.workie.repository;

import kr.co.workie.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // 특정 채팅방의 메시지들을 시간순으로 조회
    List<ChatMessage> findByRoomIdOrderByCreatedAtAsc(String roomId);

    // 특정 채팅방의 최근 N개 메시지 조회
    @Query("SELECT c FROM ChatMessage c WHERE c.roomId = :roomId ORDER BY c.createdAt DESC LIMIT :limit")
    List<ChatMessage> findRecentMessagesByRoomId(@Param("roomId") String roomId, @Param("limit") int limit);

    // 특정 사용자가 보낸 메시지 조회
    List<ChatMessage> findBySenderOrderByCreatedAtDesc(String sender);
}