package kr.co.workie.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@Configuration
public class CorsConfig implements WebMvcConfigurer {
/*

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        // RESTfull 서비스를 위한 CORS 설정
        registry
                .addMapping("/**")        // 모든 엔드포인트에 대한 접근허용
                .allowedOrigins(
                        "http://localhost:5173", // 로컬 개발용
                        "https://workie-talkie.site", // 실제 도메인
                        "https://lotte2-community-app-project-team3-lac.vercel.app", // 팀 프로젝트 배포 주소
                        "https://workie-talkie-personal-kappa.vercel.app" // 개인 배포 주소
                        )           // 해당 도메인 origin의 요청 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // 허용할 Methods 설정
                .allowedHeaders("*")        // 모든 헤더 정보 허용
                .allowCredentials(true)     // 자격 증명 허용
                .maxAge(3600);              // pre-flight 요청의 유효시간 설정
    }

 */
}
