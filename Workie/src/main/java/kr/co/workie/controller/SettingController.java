package kr.co.workie.controller;

import kr.co.workie.dto.UserDTO;
import kr.co.workie.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Log4j2
@RequiredArgsConstructor
@RequestMapping("/setting")
@RestController
public class SettingController {

    private final UserService userService;

    @GetMapping("/profile/{id}")
    public UserDTO profile(@PathVariable String id) {
        return userService.findById(id);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateProfile(@RequestBody UserDTO userDTO) {
        log.info(userDTO);

        UserDTO modifiedUser = userService.modify(userDTO);

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(modifiedUser);

    }
}
