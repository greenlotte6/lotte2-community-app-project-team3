package kr.co.workie.controller;

import kr.co.workie.dto.BoardDTO;
import kr.co.workie.dto.CalendarDTO;
import kr.co.workie.dto.PageDTO;
import kr.co.workie.entity.Page;
import kr.co.workie.entity.User;
import kr.co.workie.repository.PageRepository;
import kr.co.workie.service.BoardService;
import kr.co.workie.service.CalendarService;
import kr.co.workie.service.PageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import kr.co.workie.security.MyUserDetails;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RestController
public class AppController {

    private final CalendarService calendarService;
    private final PageService pageService;
    private final PageRepository pageRepository;
    private final BoardService boardService;

    @Value("${spring.application.version}")
    private String appVersion;


    @GetMapping("/")
    public String index(){
        //System.out.println("appVersion : " + appVersion);
        return "appVersion : " + appVersion;
    }



    /* Calendar */
    // 캘린더 조회
    @GetMapping("/calendar")
    public List<CalendarDTO> calendar(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            // 인증되지 않은 경우 처리 (예: 로그인 페이지로 리다이렉트 또는 401 Unauthorized 반환)
            // 여기서는 예시로 빈 리스트 반환
            return new ArrayList<>(); // 또는 throw new AccessDeniedException("User not authenticated");
        }

        // MyUserDetails 객체를 가져온 후, 그 안에서 실제 User 엔티티를 추출
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        String loginId = user.getId();

        log.info("✅ 현재 로그인 ID = {}", loginId);

        return calendarService.getEventsByWriter(loginId);
    }

    // 일정 추가
    @PostMapping("/calendar/add")
    public Map<String, Integer> addCalendar(Authentication authentication, @RequestBody CalendarDTO calendarDTO) {
        log.info("📩 calendarDTO = {}", calendarDTO);
        if (authentication == null || !authentication.isAuthenticated()) {
            // 인증되지 않은 경우 처리 (예: 로그인 페이지로 리다이렉트 또는 401 Unauthorized 반환)
            // 여기서는 예시로 빈 리스트 반환
            throw new AccessDeniedException("User not authenticated"); // 또는 throw new AccessDeniedException("User not authenticated");
        }

        // MyUserDetails 객체를 가져온 후, 그 안에서 실제 User 엔티티를 추출
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
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

    //일정 삭제
    @DeleteMapping("/calendar/{cno}")
    public ResponseEntity<?> deleteCalendar(@PathVariable int cno) {
        calendarService.deleteCalendar(cno);
        return ResponseEntity.ok().build();
    }

    /* Page */
    //페이지 조회
    @GetMapping("/page")
    public List<Page> page(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            // 인증되지 않은 경우 처리 (예: 로그인 페이지로 리다이렉트 또는 401 Unauthorized 반환)
            // 여기서는 예시로 빈 리스트 반환
            return new ArrayList<>(); // 또는 throw new AccessDeniedException("User not authenticated");
        }

        // MyUserDetails 객체를 가져온 후, 그 안에서 실제 User 엔티티를 추출
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        String loginId = user.getId();
        log.info("✅ 현재 로그인 ID = {}", loginId);

        return pageService.getPageByWriter(loginId);
    }

    //페이지 추가
    @PostMapping("/page/add")
    public Map<String, Integer> addPage(Authentication authentication, @RequestBody PageDTO pageDTO) {
        log.info("pageDTO = {}", pageDTO);
        if (authentication == null || !authentication.isAuthenticated()) {
            // 인증되지 않은 경우 처리 (예: 로그인 페이지로 리다이렉트 또는 401 Unauthorized 반환)
            // 여기서는 예시로 빈 리스트 반환
            throw new AccessDeniedException("User not authenticated"); // 또는 throw new AccessDeniedException("User not authenticated");
        }

        // MyUserDetails 객체를 가져온 후, 그 안에서 실제 User 엔티티를 추출
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        String loginId = user.getId();

        log.info("작성자 ID = {}", loginId);

        int no = pageService.addPage(loginId, pageDTO);

        return Map.of("pno", no);
    }

    //페이지 수정
    @PutMapping("/page/{pno}")
    public ResponseEntity<?> updatePage(@PathVariable int pno, @RequestBody PageDTO pageDTO) {
        pageService.updatePage(pno, pageDTO);

        return ResponseEntity.ok().build();
    }

    //단일 페이지 조회
    @GetMapping("/page/{pno}")
    public ResponseEntity<PageDTO> getPage(@PathVariable int pno) {
        PageDTO dto = pageService.findPage(pno);
        return ResponseEntity.ok(dto);
    }


    //페이지 삭제(임시)
    @PutMapping("/page/delete/{pno}")
    public ResponseEntity<?> deletePage(@PathVariable int pno) {
        pageService. trashPage(pno); //상태 변경

        return ResponseEntity.ok().build();
    }

    //페이지 복구
    @PutMapping("/page/recover/{pno}")
    public ResponseEntity<?> recoveryPage(@PathVariable int pno) {
        pageService.recoveryPage(pno); //상태 변경

        return ResponseEntity.ok().build();
    }

    //페이지 삭제(완전삭제)
    @DeleteMapping("/page/{pno}")
    public ResponseEntity<?> actualDeletePage(@PathVariable int pno) {
        pageService.deletePage(pno);

        return ResponseEntity.ok().build();
    }




    //페이지 공유 멤버 추가 - 일단 보류!

    //즐겨찾기
    @PutMapping("/page/favorite/{pno}")
    public ResponseEntity<?> favorite(@PathVariable int pno,  @RequestBody PageDTO pageDTO) {
        int result = pageService.addFavorite(pno, pageDTO.isFavorite());
        return ResponseEntity.ok(result);
    }

    //페이지 사이드바 - 작성자별 총 갯수
    @GetMapping("/page/count")
    public int  getPageCountByCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            // 인증되지 않은 경우 처리 (예: 로그인 페이지로 리다이렉트 또는 401 Unauthorized 반환)
            // 여기서는 예시로 빈 리스트 반환
            return 0; // 또는 throw new AccessDeniedException("User not authenticated");
        }

        // MyUserDetails 객체를 가져온 후, 그 안에서 실제 User 엔티티를 추출
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        String loginId = user.getId();
        log.info("✅ Current user ID for page count: {}", loginId);

        return pageService.countPagesByWriter(user.getId());
    }


    //페이지 사이드바 - 작성자별 최근 페이지
    @GetMapping("/page/recent")
    public List<PageDTO> recentPages(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            // 인증되지 않은 경우 처리 (예: 로그인 페이지로 리다이렉트 또는 401 Unauthorized 반환)
            // 여기서는 예시로 빈 리스트 반환
            return new ArrayList<>(); // 또는 throw new AccessDeniedException("User not authenticated");
        }

        // MyUserDetails 객체를 가져온 후, 그 안에서 실제 User 엔티티를 추출
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        String loginId = user.getId();

        return pageService.getRecentPages(loginId);
    }

    //페이지 사이드바 - 작성자별 부모 페이지
    @GetMapping("/page/parent")
    public List<Page> getRootPages(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            // 인증되지 않은 경우 처리 (예: 로그인 페이지로 리다이렉트 또는 401 Unauthorized 반환)
            // 여기서는 예시로 빈 리스트 반환
            return new ArrayList<>(); // 또는 throw new AccessDeniedException("User not authenticated");
        }

        // MyUserDetails 객체를 가져온 후, 그 안에서 실제 User 엔티티를 추출
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        String loginId = user.getId();
        return pageService.getPagesByParent(loginId);
    }

    /* Board */

    //게시판 글쓰기
    @PostMapping("/board/write")
    public Map<String, Integer> createArticle(Authentication authentication,@RequestBody BoardDTO boardDTO) {
        if (authentication == null || !authentication.isAuthenticated()) {
            // 인증되지 않은 경우 처리 (예: 로그인 페이지로 리다이렉트 또는 401 Unauthorized 반환)
            // 여기서는 예시로 빈 리스트 반환
            throw new AccessDeniedException("User not authenticated"); // 또는 throw new AccessDeniedException("User not authenticated");
        }

        // MyUserDetails 객체를 가져온 후, 그 안에서 실제 User 엔티티를 추출
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        String loginId = user.getId();
        int no = boardService.addArticle(loginId, boardDTO);
        return Map.of("ano", no);
    }

    //게시판 글 리스트 (게시판 별)
    @GetMapping("/board/{category}")
    public ResponseEntity<?> getBoardsByCategory(@PathVariable String category) {
        List<BoardDTO> list = boardService.getBoardsByCategory(category);
        return ResponseEntity.ok(list);
    }

    //게시판 글 리스트 (메인)
    @GetMapping("/board/notices")
    public void getTop5Notices(){

    }

    @GetMapping("/board/required")
    public void getRequiredNotices(){

    }

    @GetMapping("/board/frees")
    public void getTop3frees() {

    }

    //게시판 글 보기
    @GetMapping("/board/{category}/{ano}")
    public void viewArticle(@PathVariable int ano) {

    }

    //게시판 글 삭제
    @DeleteMapping("/board/delete/{ano}")
    public void deleteArticle(@PathVariable int ano){

    }

    //게시판 글 수정
    @PutMapping("/board/{ano}")
    public void modifyArticle(@PathVariable int ano){

    }

    //게시판 글 고정하기(공지사항)
    @PutMapping("/page/pinned/{ano}")
    public void pinnedNotice(@PathVariable int ano){

    }


}
