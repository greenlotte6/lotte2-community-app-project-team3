package kr.co.workie.repository;

import kr.co.workie.entity.ChannelMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChannelMemberRepository extends JpaRepository<ChannelMember, Long> {

    // 특정 채널의 모든 멤버 조회
    List<ChannelMember> findByChannelId(Long channelId);

    // 특정 사용자의 모든 채널 멤버십 조회 (String으로 변경)
    List<ChannelMember> findByUserId(String userId);

    // 특정 채널에서 특정 사용자의 멤버십 조회 (String으로 변경)
    Optional<ChannelMember> findByChannelIdAndUserId(Long channelId, String userId);

    // 특정 채널의 멤버 수 조회
    long countByChannelId(Long channelId);

    // 특정 채널에서 사용자 멤버십 존재 여부 확인 (String으로 변경)
    boolean existsByChannelIdAndUserId(Long channelId, String userId);

    // 특정 채널의 소유자 조회
    @Query("SELECT cm FROM ChannelMember cm " +
            "WHERE cm.channel.id = :channelId AND cm.role = 'OWNER'")
    Optional<ChannelMember> findOwnerByChannelId(@Param("channelId") Long channelId);

    // 특정 채널에서 소유자가 아닌 첫 번째 멤버 조회 (관리자 이임용)
    @Query("SELECT cm FROM ChannelMember cm " +
            "WHERE cm.channel.id = :channelId AND cm.role != 'OWNER' " +
            "ORDER BY cm.joinedAt ASC")
    List<ChannelMember> findNonOwnersByChannelIdOrderByJoinedAt(@Param("channelId") Long channelId);

    // 채널과 사용자로 멤버십 삭제 (String으로 변경)
    void deleteByChannelIdAndUserId(Long channelId, String userId);
}