package kr.co.workie.security;

import kr.co.workie.security.filter.JWTAuthenticationFilter;
import kr.co.workie.util.JWTProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configurers.FormLoginConfigurer;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Autowired
    private JWTProvider jwtProvider;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {

        // 토큰기반 인증 시큐리티 설정
        httpSecurity
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(CsrfConfigurer::disable)
                .httpBasic(HttpBasicConfigurer::disable)
                .formLogin(FormLoginConfigurer::disable)
                .sessionManagement(config -> config.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // 토큰 검사 필터 등록
                .addFilterBefore(new JWTAuthenticationFilter(jwtProvider), UsernamePasswordAuthenticationFilter.class)

                .authorizeHttpRequests(authorize -> authorize
                        // CORS Preflight 허용
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 🔧 인증이 필요하지 않은 경로들
                        .requestMatchers("/api/user/check").permitAll()
                        .requestMatchers("/api/user/register").permitAll()
                        .requestMatchers("/api/user/login").permitAll()
                        .requestMatchers("/calendar/upcoming").permitAll()
                        .requestMatchers("/", "/user/**", "/api/user/**").permitAll()
                        .requestMatchers("/favicon.ico", "/css/**", "/js/**", "/images/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/project", "/api/project/**").authenticated() // ⭐ 이 부분을 수정해야 합니다.

                        // 🔧 관리자 권한 필요
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/setting/plan").hasRole("ADMIN")
                        .requestMatchers("/admin/board").hasRole("ADMIN")
                        .requestMatchers("/admin/project").hasRole("ADMIN")
                        .requestMatchers("/admin/member").hasRole("ADMIN")

                        // 🔧 새로 추가: 인증이 필요한 경로들
                        .requestMatchers("/page/**").authenticated()
                        .requestMatchers("/calendar/**").authenticated()
                        .requestMatchers("/user/profile/**").authenticated()
                        .requestMatchers("/chat/**").authenticated()
                        .requestMatchers("/channel/**").authenticated()
                        .requestMatchers("/dm/**").authenticated()

                        // ✅ 새로 추가: DM 및 채널 API 경로들 (핵심 수정!)
                        .requestMatchers("/api/dm/**").authenticated()          // DM API
                        .requestMatchers("/channels/**").authenticated()        // 채널 API
                        .requestMatchers("/channels/health").permitAll()        // 헬스체크는 허용


                        // ✅ API 경로들만 새로 추가 (문제 해결용)
                        .requestMatchers("/users/search").authenticated()
                        .requestMatchers("/api/users/me").authenticated()
                        .requestMatchers("/api/channels/**").authenticated()
                        .requestMatchers("/api/messages/**").authenticated()
                        .requestMatchers("/api/users/search").authenticated()

                        // 🔧 나머지는 인증 필요로 변경 (보안 강화)
                        .anyRequest().authenticated()
                );

        return httpSecurity.build();
    }

    // Security 인증 암호화 인코더 설정
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }


    // CORS 설정 Bean 추가
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:5173", // 프론트엔드 개발 서버
                "https://workie-talkie.site",
                "https://lotte2-community-app-project-team3-lac.vercel.app",
                "https://workie-talkie-personal-kappa.vercel.app",
                "http://3.36.66.1:8080"
        ));

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}