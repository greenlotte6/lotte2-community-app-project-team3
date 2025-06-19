package kr.co.workie.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import kr.co.workie.dto.UserDTO;
import kr.co.workie.entity.User;
import kr.co.workie.security.MyUserDetails;
import kr.co.workie.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log4j2
@RequiredArgsConstructor
@RequestMapping("/setting")
@RestController
public class SettingController {

    private final UserService userService;

    @GetMapping("/profile")
    public UserDTO getProfile(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            // 인증되지 않은 경우 처리 (예: 로그인 페이지로 리다이렉트 또는 401 Unauthorized 반환)
            // 여기서는 예시로 빈 리스트 반환
            throw new AccessDeniedException("User not authenticated"); // 또는 throw new AccessDeniedException("User not authenticated");
        }

        // MyUserDetails 객체를 가져온 후, 그 안에서 실제 User 엔티티를 추출
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        String loginId = user.getId();

        log.info("✅ 현재 로그인 ID = {}", loginId);
        log.info(userService.findById(loginId));

        return userService.findById(loginId);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateProfile(Authentication authentication, @RequestBody UserDTO userDTO) {
        if (authentication == null || !authentication.isAuthenticated()) {
            // 인증되지 않은 경우 처리 (예: 로그인 페이지로 리다이렉트 또는 401 Unauthorized 반환)
            // 여기서는 예시로 빈 리스트 반환
            throw new AccessDeniedException("User not authenticated"); // 또는 throw new AccessDeniedException("User not authenticated");
        }

        // MyUserDetails 객체를 가져온 후, 그 안에서 실제 User 엔티티를 추출
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        String loginId = user.getId();

        UserDTO modifiedUser = userService.modify(userDTO);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(modifiedUser);
    }

    @GetMapping("/member")
    public List<UserDTO> getMember(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("User not authenticated");
        }
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        String loginId = user.getId();
        log.info("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        log.info("✅ 조회된 아이디: {}",userService.findById(loginId));

        // ✅ UserService를 통해 joinCode 조회
        String joinCode = userService.findJoinCodeByCeoId(loginId);
        log.info("🏢 회사의 JoinCode: {}", joinCode);

        List<UserDTO> members = userService.findMembersByJoinCode(joinCode);
        log.info("✅ 조회된 구성원 수: {}", members.size());

        return members;
    }

    @PutMapping("/member/{id}")
    public ResponseEntity<?> modifyUser(@PathVariable String id, @RequestBody UserDTO userDTO) {
        userDTO.setId(id);
        userService.modify(userDTO);
        return ResponseEntity.ok().build();
    }
}
