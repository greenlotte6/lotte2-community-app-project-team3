package kr.co.workie.repository;

import kr.co.workie.entity.Channel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChannelRepository extends JpaRepository<Channel, Long> {

    // 사용자가 참여한 채널 목록 조회 (String userId 버전)
    @Query("SELECT DISTINCT c FROM Channel c " +
            "JOIN c.members cm " +
            "WHERE cm.userId = :userId " +
            "ORDER BY c.updatedAt DESC")
    List<Channel> findChannelsByUserIdString(@Param("userId") String userId);

    // 채널명으로 검색
    List<Channel> findByNameContainingIgnoreCase(String name);

    // 채널 소유자로 검색 (String 버전)
    List<Channel> findByOwnerId(String ownerId);

    // 채널 ID와 사용자 ID로 해당 사용자가 채널 멤버인지 확인 (String userId 버전)
    @Query("SELECT COUNT(cm) > 0 FROM Channel c " +
            "JOIN c.members cm " +
            "WHERE c.id = :channelId AND cm.userId = :userId")
    boolean existsByChannelIdAndUserId(@Param("channelId") Long channelId,
                                       @Param("userId") String userId);

    // 채널과 멤버 정보를 함께 조회 (N+1 문제 해결)
    @Query("SELECT c FROM Channel c " +
            "LEFT JOIN FETCH c.members cm " +
            "WHERE c.id = :channelId")
    Optional<Channel> findByIdWithMembers(@Param("channelId") Long channelId);
}