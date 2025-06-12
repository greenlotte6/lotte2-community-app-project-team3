package kr.co.workie.repository;

import kr.co.workie.entity.DirectMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DirectMessageRepository extends JpaRepository<DirectMessage, Long> {

    // 사용자가 참여한 모든 DM 조회
    @Query("SELECT dm FROM DirectMessage dm " +
            "WHERE dm.user1Id = :userId OR dm.user2Id = :userId " +
            "ORDER BY dm.updatedAt DESC")
    List<DirectMessage> findByUserId(@Param("userId") String userId);

    // 두 사용자 간의 DM 조회
    @Query("SELECT dm FROM DirectMessage dm " +
            "WHERE (dm.user1Id = :user1Id AND dm.user2Id = :user2Id) " +
            "OR (dm.user1Id = :user2Id AND dm.user2Id = :user1Id)")
    Optional<DirectMessage> findByTwoUsers(@Param("user1Id") String user1Id,
                                           @Param("user2Id") String user2Id);

    // roomId로 DM 조회
    Optional<DirectMessage> findByRoomId(String roomId);

    // 사용자가 참여한 DM 개수 조회
    @Query("SELECT COUNT(dm) FROM DirectMessage dm " +
            "WHERE dm.user1Id = :userId OR dm.user2Id = :userId")
    long countByUserId(@Param("userId") String userId);

    // 특정 사용자가 참여한 DM 존재 여부 확인
    @Query("SELECT COUNT(dm) > 0 FROM DirectMessage dm " +
            "WHERE (dm.user1Id = :user1Id AND dm.user2Id = :user2Id) " +
            "OR (dm.user1Id = :user2Id AND dm.user2Id = :user1Id)")
    boolean existsByTwoUsers(@Param("user1Id") String user1Id,
                             @Param("user2Id") String user2Id);
}