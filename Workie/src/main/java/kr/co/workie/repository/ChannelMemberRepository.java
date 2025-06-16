package kr.co.workie.repository;

import kr.co.workie.entity.ChannelMember;
// ❌ 제거: import kr.co.workie.entity.MemberRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChannelMemberRepository extends JpaRepository<ChannelMember, Long> {

    // 기존 메서드들...
    List<ChannelMember> findByChannelId(Long channelId);
    List<ChannelMember> findByUserId(String userId);
    Optional<ChannelMember> findByChannelIdAndUserId(Long channelId, String userId);
    long countByChannelId(Long channelId);
    boolean existsByChannelIdAndUserId(Long channelId, String userId);

    @Query("SELECT cm FROM ChannelMember cm " +
            "WHERE cm.channel.id = :channelId AND cm.role = 'OWNER'")
    Optional<ChannelMember> findOwnerByChannelId(@Param("channelId") Long channelId);

    @Query("SELECT cm FROM ChannelMember cm " +
            "WHERE cm.channel.id = :channelId AND cm.role != 'OWNER' " +
            "ORDER BY cm.joinedAt ASC")
    List<ChannelMember> findNonOwnersByChannelIdOrderByJoinedAt(@Param("channelId") Long channelId);

    // ✅ 수정: ChannelMember.MemberRole 사용
    List<ChannelMember> findByUserIdAndRole(String userId, ChannelMember.MemberRole role);
    List<ChannelMember> findByChannelIdAndRole(Long channelId, ChannelMember.MemberRole role);

    @Query("SELECT cm FROM ChannelMember cm " +
            "WHERE cm.userId = :userId AND cm.role = 'OWNER'")
    List<ChannelMember> findOwnerChannelsByUserId(@Param("userId") String userId);

    @Query("SELECT cm FROM ChannelMember cm " +
            "WHERE cm.userId = :userId AND cm.role = 'ADMIN'")
    List<ChannelMember> findAdminChannelsByUserId(@Param("userId") String userId);

    @Query("SELECT cm FROM ChannelMember cm " +
            "WHERE cm.userId = :userId AND cm.role = 'MEMBER'")
    List<ChannelMember> findMemberChannelsByUserId(@Param("userId") String userId);

    @Query("SELECT cm FROM ChannelMember cm " +
            "WHERE cm.channel.id = :channelId AND cm.userId = :userId " +
            "AND (cm.role = 'OWNER' OR cm.role = 'ADMIN')")
    Optional<ChannelMember> findAdminOrOwnerByChannelIdAndUserId(
            @Param("channelId") Long channelId,
            @Param("userId") String userId);

    @Query("SELECT cm FROM ChannelMember cm " +
            "WHERE cm.channel.id = :channelId AND cm.role = 'ADMIN'")
    List<ChannelMember> findAdminsByChannelId(@Param("channelId") Long channelId);

    @Query("SELECT CASE WHEN COUNT(cm) > 0 THEN true ELSE false END " +
            "FROM ChannelMember cm " +
            "WHERE cm.channel.id = :channelId AND cm.userId = :userId AND cm.role = 'OWNER'")
    boolean isOwnerOfChannel(@Param("channelId") Long channelId, @Param("userId") String userId);

    @Query("SELECT CASE WHEN COUNT(cm) > 0 THEN true ELSE false END " +
            "FROM ChannelMember cm " +
            "WHERE cm.channel.id = :channelId AND cm.userId = :userId " +
            "AND (cm.role = 'OWNER' OR cm.role = 'ADMIN')")
    boolean hasAdminPermission(@Param("channelId") Long channelId, @Param("userId") String userId);

    @Query("SELECT cm.role as role, COUNT(cm) as count " +
            "FROM ChannelMember cm " +
            "WHERE cm.channel.id = :channelId " +
            "GROUP BY cm.role")
    List<Object[]> countMembersByRoleAndChannelId(@Param("channelId") Long channelId);

    void deleteByChannelIdAndUserId(Long channelId, String userId);
    void deleteByChannelId(Long channelId);
}