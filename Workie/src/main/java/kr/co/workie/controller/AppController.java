package kr.co.workie.controller;

import kr.co.workie.dto.BoardDTO;
import kr.co.workie.dto.CalendarDTO;
import kr.co.workie.dto.CommentDTO;
import kr.co.workie.dto.PageDTO;
import kr.co.workie.entity.Page;
import kr.co.workie.entity.User;
import kr.co.workie.repository.BoardRepository;
import kr.co.workie.repository.PageRepository;
import kr.co.workie.service.BoardService;
import kr.co.workie.service.CalendarService;
import kr.co.workie.service.PageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<?> getTop5Notices(){
        List<BoardDTO> notices = boardService.getNotices("notice");

        return ResponseEntity.ok(notices);

    }

    @GetMapping("/board/required")
    public ResponseEntity<?> getRequiredNotices(){
        List<BoardDTO> pinnedNotices = boardService.getPinnedNotices(true);

        return ResponseEntity.ok(pinnedNotices);
    }

    @GetMapping("/board/frees")
    public ResponseEntity<?> getTop3frees() {
        List<BoardDTO> frees = boardService.getFrees("free");

        return ResponseEntity.ok(frees);
    }

    @GetMapping("/board/menus")
    public ResponseEntity<?> getTop3menus() {
        List<BoardDTO> menus = boardService.getMenus("menu");

        return ResponseEntity.ok(menus);
    }

    @GetMapping("/board/recent")
    public ResponseEntity<?> getTop3recent() {
        List<BoardDTO> recent = boardService.getRecent();

        return ResponseEntity.ok(recent);
    }

    //게시판 글 보기
    @GetMapping("/board/{category}/{ano}")
    public ResponseEntity<BoardDTO> viewArticle(@PathVariable int ano, @PathVariable String category, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("User not authenticated");
        }

        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        String loginId = user.getId();

        BoardDTO boardDTO = boardService.findById(ano);

        return new ResponseEntity<>(boardDTO, HttpStatus.OK);
    }

    //게시판 글 삭제
    @DeleteMapping("/board/delete/{ano}")
    public ResponseEntity<?> deleteArticle(@PathVariable int ano){
        boardService.deleteArticle(ano);

        return ResponseEntity.ok().build();

    }

    //게시판 글 수정
    @PutMapping("/board/{ano}")
    public ResponseEntity<?> modifyArticle(@PathVariable int ano, @RequestBody BoardDTO boardDTO) {
        boardService.updateArticle(ano,boardDTO);

        return ResponseEntity.ok().build();
    }

    //게시판 글 고정하기(공지사항)
    @PutMapping("/board/pinned/{ano}")
    public ResponseEntity<?> pinnedNotice(@PathVariable int ano, @RequestBody BoardDTO boardDTO) {
        try {
            int result = boardService.pinnedArticle(ano, boardDTO.isPinned());
            return ResponseEntity.ok(result);
        } catch (IllegalStateException e) {
            // 이미 고정된 게시물이 2개 이상일 경우
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    //댓글 출력
    @GetMapping("/board/comments/{ano}")
    public List<CommentDTO> commentsList(@PathVariable int ano) {
        return boardService.getComments(ano);

    }

    //댓글 달기
    @PostMapping("/board/comments/{ano}")
    public void addComments(@PathVariable int ano, @RequestBody CommentDTO commentDTO, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("User not authenticated");
        }

        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        String loginId = user.getId();

        boardService.addComment(loginId, ano, commentDTO);
    }

    //댓글 수정
    @PutMapping("/board/comments/{cno}")
    public void modifyComment(@PathVariable int cno, @RequestBody CommentDTO commentDTO) {
        boardService.updateComment(cno, commentDTO);
    }
    
    //댓글 삭제
    @DeleteMapping("/board/comments/{cno}")
    public void deleteComment(@PathVariable int cno) {
        boardService.deleteComment(cno);
    }


}
