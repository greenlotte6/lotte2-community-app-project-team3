package kr.co.workie.config;

import kr.co.workie.dto.UserDTO;  // 🔥 UserDTO import 추가
import kr.co.workie.service.UserService;  // 🔥 UserService import 추가
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.security.Principal;

@Slf4j  // 🔥 Slf4j 추가
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    // 🔥 UserService 주입
    private final UserService userService;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (accessor != null) {
                    log.debug("WebSocket 메시지 - Command: {}, SessionId: {}",
                            accessor.getCommand(), accessor.getSessionId());

                    // CONNECT 시 사용자 인증 정보 설정
                    if (StompCommand.CONNECT.equals(accessor.getCommand())) {

                        // 🔥 1단계: Authorization 헤더에서 JWT 토큰 확인
                        String authHeader = accessor.getFirstNativeHeader("Authorization");
                        if (authHeader != null && authHeader.startsWith("Bearer ")) {
                            String token = authHeader.substring(7);
                            try {
                                // JWT 토큰에서 사용자 정보 추출 (JwtUtil 사용)
                                // String username = jwtUtil.extractUsername(token);
                                // Principal principal = () -> username;
                                // accessor.setUser(principal);
                                // log.info("WebSocket 연결 - JWT 토큰으로 인증된 사용자: {}", username);
                                log.info("WebSocket JWT 토큰 수신: {}", token.substring(0, Math.min(20, token.length())) + "...");
                            } catch (Exception e) {
                                log.error("JWT 토큰 검증 실패: {}", e.getMessage());
                            }
                        }

                        // 🔥 2단계: SecurityContext에서 현재 인증된 사용자 정보 가져오기
                        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                        log.info("SecurityContext 인증 정보: {}", auth);

                        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
                            // 인증된 사용자인 경우
                            Principal principal = auth;
                            accessor.setUser(principal);
                            log.info("✅ WebSocket 연결 - SecurityContext에서 인증된 사용자: {}", auth.getName());
                        }
                        // 🔥 3단계: UserService를 통해 현재 사용자 정보 확인 시도
                        else {
                            try {
                                // UserService의 getCurrentUser() 호출해서 실제 로그인한 사용자 확인
                                UserDTO currentUser = userService.getCurrentUser();
                                if (currentUser != null && currentUser.getId() != null) {
                                    Principal userPrincipal = () -> currentUser.getId();
                                    accessor.setUser(userPrincipal);
                                    log.info("✅ WebSocket 연결 - UserService에서 인증된 사용자: {} ({})",
                                            currentUser.getName(), currentUser.getId());
                                } else {
                                    log.warn("❌ UserService에서 사용자 정보를 찾을 수 없음");
                                    // 🔥 기본 사용자 설정 제거 - 인증되지 않은 상태로 유지
                                    accessor.setUser(null);
                                }
                            } catch (Exception e) {
                                log.error("❌ UserService 호출 실패: {}", e.getMessage());
                                // 🔥 에러 시에도 기본 사용자 설정하지 않음
                                accessor.setUser(null);
                            }
                        }
                    }

                    // 메시지 전송 시 사용자 정보 유지
                    if (StompCommand.SEND.equals(accessor.getCommand())) {
                        Principal user = accessor.getUser();
                        if (user != null) {
                            log.debug("📤 메시지 전송 - 사용자: {}", user.getName());
                        } else {
                            log.warn("⚠️ 메시지 전송 - 사용자 정보 없음");
                        }
                    }
                }

                return message;
            }
        });
    }
}