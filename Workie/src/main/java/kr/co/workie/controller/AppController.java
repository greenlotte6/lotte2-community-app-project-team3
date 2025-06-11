package kr.co.workie.controller;

import kr.co.workie.dto.CalendarDTO;
import kr.co.workie.dto.UserDTO;
import kr.co.workie.repository.UserRepository;
import kr.co.workie.service.CalendarService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RestController
public class AppController {

    private final CalendarService calendarService;

    //캘린더
    @GetMapping("/calendar")
    public UserDTO calendar(Authentication authentication) {
        String loginId = authentication.getName();

        return calendarService.findByWriter(loginId);
    }

    @PostMapping("/calendar/add")
    public Map<String, Integer> addCalendar(Authentication authentication, CalendarDTO calendarDTO) {
        String loginId = authentication.getName();

        int no = calendarService.addEvent(loginId, calendarDTO);

        return Map.of("cno", no);
    }
}
