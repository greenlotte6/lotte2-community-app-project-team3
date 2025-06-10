package kr.co.workie.util;

import kr.co.workie.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;

import java.security.SecureRandom;

@RequiredArgsConstructor
public class GenerateJoinCode {
    private final CompanyRepository companyRepository;

    // 10자리 알파벳+숫자 조합의 고유한 joinCode 생성 메서드
    private String generateUniqueJoinCode() {
        String CHAR_LOWER = "abcdefghijklmnopqrstuvwxyz";
        String CHAR_UPPER = CHAR_LOWER.toUpperCase();
        String NUMBER = "0123456789";
        String DATA_FOR_RANDOM_STRING = CHAR_LOWER + CHAR_UPPER + NUMBER;
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(10);
        String generatedCode;

        do {
            sb.setLength(0); // 기존 내용 초기화
            for (int i = 0; i < 10; i++) {
                int rndCharAt = random.nextInt(DATA_FOR_RANDOM_STRING.length());
                char rndChar = DATA_FOR_RANDOM_STRING.charAt(rndCharAt);
                sb.append(rndChar);
            }
            generatedCode = sb.toString();
        } while (companyRepository.existsByJoinCode(generatedCode)); // Company 테이블에 해당 joinCode가 이미 있는지 확인

        return generatedCode;
    }
}
