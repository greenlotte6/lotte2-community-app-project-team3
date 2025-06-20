package kr.co.workie.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.co.workie.util.JWTProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Log4j2
@RequiredArgsConstructor
@Component
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private final JWTProvider jwtProvider;

    private static final String AUTH_HEADER = "Authorization";
    private static final String TOKEN_PREFIX = "Bearer ";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        log.info("doFilterInternal...1 : {}", requestURI);

        // 🔧 인증 불필요 경로 체크 (정확한 매칭)
        if (shouldSkipFiltering(requestURI)) {
            log.info("doFilterInternal...인증 불필요 경로: {}", requestURI);
            filterChain.doFilter(request, response);
            return;
        }

        // 🔧 정적 리소스 체크
        if (isStaticResource(requestURI)) {
            log.info("doFilterInternal...정적 리소스: {}", requestURI);
            filterChain.doFilter(request, response);
            return;
        }

        // 🔧 모든 다른 경로는 토큰 검증 필요
        String token = extractToken(request);
        log.info("doFilterInternal...3 : {}", token != null ? "토큰있음" : "토큰없음");

        if (token != null) {
            try {
                log.info("doFilterInternal...4 - 토큰 검증 시작");
                jwtProvider.validateToken(token);

                log.info("doFilterInternal...5 - 인증 객체 생성");
                Authentication authentication = jwtProvider.getAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.info("doFilterInternal...6 - 인증 성공: {}", authentication.getName());

            } catch (Exception e) {
                log.error("doFilterInternal...9 - JWT 토큰 검증 실패: {}", e.getMessage());

                SecurityContextHolder.clearContext();
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"error\":\"인증 토큰이 유효하지 않습니다\"}");
                return;
            }
        } else {
            // 🔧 토큰이 없는 경우 401 에러 반환
            log.error("doFilterInternal...10 - 토큰이 없습니다 (인증 필요 경로): {}", requestURI);
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"error\":\"인증 토큰이 필요합니다\"}");
            return;
        }

        log.info("doFilterInternal...11 - 다음 필터로 진행");
        filterChain.doFilter(request, response);
    }

    /**
     * 토큰 추출
     */
    private String extractToken(HttpServletRequest request) {

        // 1. Authorization 헤더에서 추출
        String header = request.getHeader(AUTH_HEADER);
        log.info("doFilterInternal...2 : {}", header);

        if (header != null && header.startsWith(TOKEN_PREFIX)) {
            return header.substring(TOKEN_PREFIX.length()).trim();
        }

        // 2. 쿠키에서 추출
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("access_token".equals(cookie.getName())) {
                    log.info("쿠키에서 토큰 발견");
                    return cookie.getValue();
                }
            }
        }

        return null;
    }

    /**
     * 🔧 인증 불필요 경로 체크 - 완전 일치만 허용
     */
    private boolean shouldSkipFiltering(String requestURI) {
        return requestURI.startsWith("/user/") ||  // 🔥 /user/ 로 변경 (뒤에 슬래시 추가)
                requestURI.equals("/user") ||       // 🔥 정확히 /user 인 경우만
                requestURI.startsWith("/css") ||
                requestURI.equals("/api/user/check") ||
                requestURI.equals("/api/user/register") ||
                requestURI.equals("/api/user/login") ||
                //requestURI.startsWith("/api") ||
                requestURI.startsWith("/js") ||
                requestURI.startsWith("/images") ||
                requestURI.equals("/") ||
                requestURI.equals("/favicon.ico") ||
                //requestURI.startsWith("/board") ||
                requestURI.startsWith("/static/");
    }

    /**
     * 정적 리소스 체크
     */
    private boolean isStaticResource(String requestURI) {
        return requestURI.startsWith("/css/") ||
                requestURI.startsWith("/js/") ||
                requestURI.startsWith("/images/") ||
                requestURI.startsWith("/static/");
    }
}