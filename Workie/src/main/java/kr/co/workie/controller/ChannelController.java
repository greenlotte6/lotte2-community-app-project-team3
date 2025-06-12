package kr.co.workie.controller;

import kr.co.workie.dto.ChannelDTO;
import kr.co.workie.service.ChannelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/channels")
public class ChannelController {

    private final ChannelService channelService;

    // 채널 생성
    @PostMapping
    public ResponseEntity<ChannelDTO.Response> createChannel(@RequestBody ChannelDTO.CreateRequest request) {
        try {
            log.info("채널 생성 요청: {}", request);
            ChannelDTO.Response response = channelService.createChannel(request);
            log.info("채널 생성 성공: {}", response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("채널 생성 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 사용자가 참여한 채널 목록 조회
    @GetMapping
    public ResponseEntity<List<ChannelDTO.ListResponse>> getUserChannels() {
        try {
            log.info("사용자 채널 목록 조회 요청");
            List<ChannelDTO.ListResponse> channels = channelService.getUserChannels();
            log.info("채널 목록 조회 성공, 개수: {}", channels.size());
            return ResponseEntity.ok(channels);
        } catch (Exception e) {
            log.error("채널 목록 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 채널 상세 정보 조회
    @GetMapping("/{channelId}")
    public ResponseEntity<ChannelDTO.Response> getChannelById(@PathVariable Long channelId) {
        try {
            log.info("채널 상세 조회 요청: channelId={}", channelId);
            ChannelDTO.Response response = channelService.getChannelById(channelId);
            log.info("채널 상세 조회 성공: {}", response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("채널 상세 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 채널 나가기
    @DeleteMapping("/{channelId}/leave")
    public ResponseEntity<Void> leaveChannel(@PathVariable Long channelId) {
        try {
            log.info("채널 나가기 요청: channelId={}", channelId);
            channelService.leaveChannel(channelId);
            log.info("채널 나가기 성공: channelId={}", channelId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("채널 나가기 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 채널 관리자 이임
    @PutMapping("/{channelId}/transfer")
    public ResponseEntity<Void> transferOwnership(@PathVariable Long channelId,
                                                  @RequestBody ChannelDTO.TransferOwnershipRequest request) {
        try {
            log.info("채널 관리자 이임 요청: channelId={}, newOwnerId={}", channelId, request.getNewOwnerId());
            channelService.transferOwnership(channelId, request);
            log.info("채널 관리자 이임 성공: channelId={}", channelId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("채널 관리자 이임 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}