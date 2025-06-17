package kr.co.workie.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.util.Date;

@Log4j2
@Getter
@Component
public class JWTProvider {

    private final String issuer;
    private final SecretKey secretKey;
    private final UserDetailsService userDetailsService; // ✅ 주입 추가

    public JWTProvider(
            @Value("${jwt.issuer}") String issuer,
            @Value("${jwt.secret}") String secretKey,
            UserDetailsService userDetailsService // ✅ 주입 받기
    ) {
        this.issuer = issuer;
        this.secretKey = Keys.hmacShaKeyFor(secretKey.getBytes());
        this.userDetailsService = userDetailsService;
    }

    /**
     * JWT 생성
     */
    public String createToken(kr.co.workie.entity.User user, int days) {
        Date issuedDate = new Date();
        Date expireDate = new Date(issuedDate.getTime() + Duration.ofDays(days).toMillis());

        Claims claims = Jwts.claims();
        claims.put("username", user.getId());
        claims.put("role", user.getRole());

        return Jwts.builder()
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE)
                .setIssuer(issuer)
                .setIssuedAt(issuedDate)
                .setExpiration(expireDate)
                .addClaims(claims)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * 클레임 추출
     */
    public Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * 인증 객체 반환
     */
    public Authentication getAuthentication(String token) {
        Claims claims = getClaims(token);
        String username = (String) claims.get("username");

        // ✅ UserDetails를 통해 인증 정보 가져오기
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        return new UsernamePasswordAuthenticationToken(
                userDetails,
                token,
                userDetails.getAuthorities()
        );
    }

    /**
     * JWT 유효성 검사
     */
    public void validateToken(String token) throws Exception {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
        } catch (Exception e) {
            throw new Exception("Invalid JWT token: " + e.getMessage());
        }
    }
}
