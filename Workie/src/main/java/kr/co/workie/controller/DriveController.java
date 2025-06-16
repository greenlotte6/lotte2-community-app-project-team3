package kr.co.workie.controller;

import kr.co.workie.dto.DriveItemDTO;
import kr.co.workie.dto.UserDTO;
import kr.co.workie.entity.DriveItem;
import kr.co.workie.entity.User;
import kr.co.workie.service.DriveService;
import kr.co.workie.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Log4j2
@RequiredArgsConstructor
@RequestMapping("/api/drive")
@RestController
public class DriveController {

    private final UserService userService;
    private final DriveService driveService;

    @GetMapping
    public List<DriveItemDTO> list(@RequestParam(required = false) Long parentId,
                                   Principal principal) {
        User user = userService.getUserByUid(principal.getName());
        return driveService.listDriveItems(user, parentId);
    }

    @PostMapping("/folder")
    public ResponseEntity<?> createFolder(@RequestParam String name,
                                          @RequestParam(required = false) Long parentId,
                                          Principal principal) {

        System.out.println(">> principal.getName() = " + principal.getName());
        User user = userService.getUserByUid(principal.getName());
        DriveItem folder = driveService.createFolder(user, name, parentId);
        return ResponseEntity.ok(folder.getDno());
    }

    @DeleteMapping("/{dno}")
    public ResponseEntity<?> delete(@PathVariable Long dno) {
        driveService.deleteDriveItem(dno);
        return ResponseEntity.ok().build();
    }
}

