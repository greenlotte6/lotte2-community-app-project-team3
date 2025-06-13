package kr.co.workie.repository;

import kr.co.workie.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // 특정 룸의 메시지 조회 (최신순, 페이징)
    Page<ChatMessage> findByRoomIdOrderByCreatedAtDesc(String roomId, Pageable pageable);

   // ✅ 수정 (오래된 메시지가 먼저)
    @Query("SELECT cm FROM ChatMessage cm " +
            "WHERE cm.roomId = :roomId " +
            "ORDER BY cm.createdAt ASC")
    List<ChatMessage> findRecentMessagesByRoomId(@Param("roomId") String roomId, Pageable pageable);



    // 1. 특정 룸의 메시지를 오래된 순으로 조회
    List<ChatMessage> findByRoomIdOrderByCreatedAtAsc(String roomId);

    // 특정 룸의 마지막 메시지 조회
    ChatMessage findFirstByRoomIdOrderByCreatedAtDesc(String roomId);

    // 특정 시간 이후의 메시지 조회
    List<ChatMessage> findByRoomIdAndCreatedAtAfterOrderByCreatedAt(String roomId, LocalDateTime after);

    // 특정 룸의 메시지 개수 조회
    long countByRoomId(String roomId);

    // 특정 사용자의 메시지 조회
    List<ChatMessage> findBySenderIdOrderByCreatedAtDesc(String senderId);

    // 특정 룸에서 특정 사용자의 메시지 조회
    List<ChatMessage> findByRoomIdAndSenderIdOrderByCreatedAt(String roomId, String senderId);

    // 룸 타입별 메시지 조회
    List<ChatMessage> findByRoomTypeOrderByCreatedAtDesc(ChatMessage.RoomType roomType);
}