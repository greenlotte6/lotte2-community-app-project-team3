package kr.co.workie.controller;

import kr.co.workie.dto.DriveItemDTO;
import kr.co.workie.entity.DriveItem;
import kr.co.workie.entity.User;
import kr.co.workie.security.MyUserDetails;
import kr.co.workie.service.DriveService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log4j2
@RequiredArgsConstructor
@RequestMapping("/api/drive")
@RestController
public class DriveController {

    private final DriveService driveService;

    @GetMapping
    public List<DriveItemDTO> list(@RequestParam(required = false) Long parentId,
                                   Authentication authentication) {
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        return driveService.listDriveItems(user, parentId);
    }

    @PostMapping("/folder")
    public ResponseEntity<?> createFolder(@RequestParam String name,
                                          @RequestParam(required = false) Long parentId,
                                          Authentication authentication) {

        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        DriveItem folder = driveService.createFolder(user, name, parentId);
        return ResponseEntity.ok(folder.getDno());
    }

    @DeleteMapping("/{dno}")
    public ResponseEntity<?> delete(@PathVariable Long dno) {
        driveService.deleteDriveItem(dno);
        return ResponseEntity.ok().build();
    }
}
