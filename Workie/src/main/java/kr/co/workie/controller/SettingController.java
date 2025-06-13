package kr.co.workie.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import kr.co.workie.dto.UserDTO;
import kr.co.workie.entity.User;
import kr.co.workie.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Log4j2
@RequiredArgsConstructor
@RequestMapping("/setting")
@RestController
public class SettingController {

    private final UserService userService;

    @GetMapping("/profile")
    public UserDTO getProfile(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        String loginId = user.getId();

        log.info("✅ 현재 로그인 ID = {}", loginId);
        log.info(userService.findById(loginId));

        return userService.findById(loginId);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateProfile(Authentication authentication, @RequestBody UserDTO userDTO) {
        User user = (User) authentication.getPrincipal();
        String loginId = user.getId();

        UserDTO modifiedUser = userService.modify(userDTO);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(modifiedUser);
    }
}
