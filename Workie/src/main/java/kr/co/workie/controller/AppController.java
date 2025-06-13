package kr.co.workie.controller;

import kr.co.workie.dto.CalendarDTO;
import kr.co.workie.dto.PageDTO;
import kr.co.workie.dto.UserDTO;
import kr.co.workie.entity.Page;
import kr.co.workie.entity.User;
import kr.co.workie.repository.UserRepository;
import kr.co.workie.security.MyUserDetails;
import kr.co.workie.service.CalendarService;
import kr.co.workie.service.PageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RestController
public class AppController {

    private final CalendarService calendarService;
    private final PageService pageService;

    /* Calendar */
    // 캘린더 조회
    @GetMapping("/calendar")
    public List<CalendarDTO> calendar(Authentication authentication) {
        User user = (User) authentication.getPrincipal(); // 🔧 여기 수정
        String loginId = user.getId();

        log.info("✅ 현재 로그인 ID = {}", loginId);

        return calendarService.getEventsByWriter(loginId);
    }

    // 일정 추가
    @PostMapping("/calendar/add")
    public Map<String, Integer> addCalendar(Authentication authentication, @RequestBody CalendarDTO calendarDTO) {
        log.info("📩 calendarDTO = {}", calendarDTO);

        User user = (User) authentication.getPrincipal(); // 🔧 여기 수정
        String loginId = user.getId();

        log.info("⛳ 작성자 ID = {}", loginId);

        int no = calendarService.addEvent(loginId, calendarDTO);

        return Map.of("cno", no);
    }

    //일정 수정
    @PutMapping("/calendar/{cno}")
    public ResponseEntity<?> updateCalendar(@PathVariable int cno, @RequestBody CalendarDTO calendarDTO) {
        calendarService.updateEvent(cno, calendarDTO);

        return ResponseEntity.ok().build();
    }

    //일정 삭제 - 일단 보류!

    /* Page */
    //페이지 조회
    @GetMapping("/page")
    public List<Page> page(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        String loginId = user.getId();
        log.info("✅ 현재 로그인 ID = {}", loginId);

        return pageService.getPageByWriter(loginId);
    }

    //페이지 추가
    @PostMapping("/page/add")
    public Map<String, Integer> addPage(Authentication authentication, @RequestBody PageDTO pageDTO) {
        log.info("pageDTO = {}", pageDTO);
        User user = (User) authentication.getPrincipal();
        String loginId = user.getId();

        log.info("작성자 ID = {}", loginId);

        int no = pageService.addPage(loginId, pageDTO);

        return Map.of("pno", no);
    }

    //페이지 수정


    //페이지 삭제 - 일단 보류!


    //페이지 공유 멤버 추가 - 일단 보류!

    //즐겨찾기
    @PutMapping("/page/favorite/{pno}")
    public ResponseEntity<?> favorite(@PathVariable int pno,  @RequestBody PageDTO pageDTO) {
        int result = pageService.addFavorite(pno, pageDTO.isFavorite());
        return ResponseEntity.ok(result);
    }
    
    /* Board */
    
}
