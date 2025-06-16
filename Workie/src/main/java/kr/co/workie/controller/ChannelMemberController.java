package kr.co.workie.controller;

import kr.co.workie.dto.ChannelMemberDTO;
import kr.co.workie.service.ChannelMemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/channels")
public class ChannelMemberController {

    private final ChannelMemberService channelMemberService;

    /**
     * 채널 멤버 목록 조회
     * GET /api/channels/{channelId}/members
     */
    @GetMapping("/{channelId}/members")
    public ResponseEntity<List<ChannelMemberDTO.Response>> getChannelMembers(@PathVariable Long channelId) {
        try {
            log.info("채널 멤버 목록 조회 요청 - 채널ID: {}", channelId);

            List<ChannelMemberDTO.Response> members = channelMemberService.getChannelMembers(channelId);

            log.info("채널 멤버 목록 조회 성공 - 채널ID: {}, 멤버수: {}", channelId, members.size());
            return ResponseEntity.ok(members);

        } catch (Exception e) {
            log.error("채널 멤버 목록 조회 실패 - 채널ID: {}, 에러: {}", channelId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 채널에 멤버 추가
     * POST /api/channels/{channelId}/members
     */
    @PostMapping("/{channelId}/members")
    public ResponseEntity<ChannelMemberDTO.Response> addMemberToChannel(
            @PathVariable Long channelId,
            @RequestBody ChannelMemberDTO.AddRequest request) {
        try {
            log.info("채널 멤버 추가 요청 - 채널ID: {}, 대상사용자: {}", channelId, request.getUserId());

            ChannelMemberDTO.Response response = channelMemberService.addMemberToChannel(channelId, request);

            log.info("채널 멤버 추가 성공 - 채널ID: {}, 멤버ID: {}", channelId, response.getId());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("채널 멤버 추가 실패 - 채널ID: {}, 에러: {}", channelId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 채널에서 멤버 제거
     * DELETE /api/channels/{channelId}/members/{userId}
     */
    @DeleteMapping("/{channelId}/members/{userId}")
    public ResponseEntity<Void> removeMemberFromChannel(
            @PathVariable Long channelId,
            @PathVariable String userId) {
        try {
            log.info("채널 멤버 제거 요청 - 채널ID: {}, 대상사용자: {}", channelId, userId);

            channelMemberService.removeMemberFromChannel(channelId, userId);

            log.info("채널 멤버 제거 성공 - 채널ID: {}, 사용자: {}", channelId, userId);
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            log.error("채널 멤버 제거 실패 - 채널ID: {}, 사용자: {}, 에러: {}", channelId, userId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 채널에 추가 가능한 사용자 목록 조회
     * GET /api/channels/{channelId}/available-users
     */
    @GetMapping("/{channelId}/available-users")
    public ResponseEntity<List<ChannelMemberDTO.AvailableUser>> getAvailableUsers(@PathVariable Long channelId) {
        try {
            log.info("추가 가능한 사용자 목록 조회 요청 - 채널ID: {}", channelId);

            List<ChannelMemberDTO.AvailableUser> availableUsers = channelMemberService.getAvailableUsers(channelId);

            log.info("추가 가능한 사용자 목록 조회 성공 - 채널ID: {}, 사용자수: {}", channelId, availableUsers.size());
            return ResponseEntity.ok(availableUsers);

        } catch (Exception e) {
            log.error("추가 가능한 사용자 목록 조회 실패 - 채널ID: {}, 에러: {}", channelId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 멤버 권한 변경
     * PUT /api/channels/{channelId}/members/role
     */
    @PutMapping("/{channelId}/members/role")
    public ResponseEntity<ChannelMemberDTO.Response> updateMemberRole(
            @PathVariable Long channelId,
            @RequestBody ChannelMemberDTO.UpdateRoleRequest request) {
        try {
            log.info("멤버 권한 변경 요청 - 채널ID: {}, 대상사용자: {}, 새권한: {}",
                    channelId, request.getUserId(), request.getNewRole());

            ChannelMemberDTO.Response response = channelMemberService.updateMemberRole(channelId, request);

            log.info("멤버 권한 변경 성공 - 채널ID: {}, 사용자: {}, 새권한: {}",
                    channelId, request.getUserId(), request.getNewRole());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("멤버 권한 변경 실패 - 채널ID: {}, 사용자: {}, 에러: {}",
                    channelId, request.getUserId(), e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 특정 멤버 정보 조회
     * GET /api/channels/{channelId}/members/{userId}
     */
    @GetMapping("/{channelId}/members/{userId}")
    public ResponseEntity<ChannelMemberDTO.Response> getChannelMember(
            @PathVariable Long channelId,
            @PathVariable String userId) {
        try {
            log.info("채널 멤버 정보 조회 요청 - 채널ID: {}, 사용자: {}", channelId, userId);

            ChannelMemberDTO.Response member = channelMemberService.getChannelMember(channelId, userId);

            log.info("채널 멤버 정보 조회 성공 - 채널ID: {}, 사용자: {}", channelId, userId);
            return ResponseEntity.ok(member);

        } catch (Exception e) {
            log.error("채널 멤버 정보 조회 실패 - 채널ID: {}, 사용자: {}, 에러: {}", channelId, userId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 내가 관리자인 채널 목록 조회
     * GET /api/channels/my-admin-channels
     */
    @GetMapping("/my-admin-channels")
    public ResponseEntity<List<ChannelMemberDTO.Response>> getMyAdminChannels() {
        try {
            log.info("내가 관리자인 채널 목록 조회 요청");

            List<ChannelMemberDTO.Response> adminChannels = channelMemberService.getMyAdminChannels();

            log.info("내가 관리자인 채널 목록 조회 성공 - 개수: {}", adminChannels.size());
            return ResponseEntity.ok(adminChannels);

        } catch (Exception e) {
            log.error("내가 관리자인 채널 목록 조회 실패 - 에러: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 채널 멤버 수 조회
     * GET /api/channels/{channelId}/member-count
     */
    @GetMapping("/{channelId}/member-count")
    public ResponseEntity<Long> getChannelMemberCount(@PathVariable Long channelId) {
        try {
            log.info("채널 멤버 수 조회 요청 - 채널ID: {}", channelId);

            long memberCount = channelMemberService.getChannelMemberCount(channelId);

            log.info("채널 멤버 수 조회 성공 - 채널ID: {}, 멤버수: {}", channelId, memberCount);
            return ResponseEntity.ok(memberCount);

        } catch (Exception e) {
            log.error("채널 멤버 수 조회 실패 - 채널ID: {}, 에러: {}", channelId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 사용자의 채널 권한 확인
     * GET /api/channels/{channelId}/my-role
     */
    @GetMapping("/{channelId}/my-role")
    public ResponseEntity<ChannelMemberDTO.RoleResponse> getMyRoleInChannel(@PathVariable Long channelId) {
        try {
            log.info("채널 내 권한 확인 요청 - 채널ID: {}", channelId);

            ChannelMemberDTO.RoleResponse roleResponse = channelMemberService.getMyRoleInChannel(channelId);

            log.info("채널 내 권한 확인 성공 - 채널ID: {}, 권한: {}", channelId, roleResponse.getRole());
            return ResponseEntity.ok(roleResponse);

        } catch (Exception e) {
            log.error("채널 내 권한 확인 실패 - 채널ID: {}, 에러: {}", channelId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}