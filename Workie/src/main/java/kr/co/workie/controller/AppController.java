package kr.co.workie.controller;

import kr.co.workie.dto.CalendarDTO;
import kr.co.workie.dto.UserDTO;
import kr.co.workie.entity.User;
import kr.co.workie.repository.UserRepository;
import kr.co.workie.security.MyUserDetails;
import kr.co.workie.service.CalendarService;
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
}
