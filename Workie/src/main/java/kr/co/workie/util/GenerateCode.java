package kr.co.workie.util;

import kr.co.workie.repository.CompanyRepository;
import kr.co.workie.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class GenerateCode {

    private static final Map<String, String> departmentCodeMap = Map.of(
            "대표", "CL",
            "인사부", "HR",
            "회계부", "AC",
            "총무부", "GA",
            "기획부", "PL",
            "영업부", "SA",
            "마케팅부", "MK",
            "IT", "IT"
    );

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    // 공통적으로 사용될 랜덤 문자열 생성 로직
    private static final String CHAR_LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String CHAR_UPPER = CHAR_LOWER.toUpperCase();
    private static final String NUMBER = "0123456789";
    private static final String DATA_FOR_RANDOM_STRING = CHAR_LOWER + CHAR_UPPER + NUMBER;
    private static final SecureRandom random = new SecureRandom();

    /**
     * 10자리 알파벳+숫자 조합의 고유한 joinCode 생성 메서드
     * Company 테이블에 해당 joinCode가 이미 있는지 확인하여 고유성을 보장합니다.
     * @return 고유한 10자리 joinCode
     */

    public String generateUniqueJoinCode() {
        StringBuilder sb = new StringBuilder(10);
        String generatedCode;

        do {
            sb.setLength(0);
            for (int i = 0; i < 10; i++) {
                int rndCharAt = random.nextInt(DATA_FOR_RANDOM_STRING.length());
                char rndChar = DATA_FOR_RANDOM_STRING.charAt(rndCharAt);
                sb.append(rndChar);
            }
            generatedCode = sb.toString();
        } while (companyRepository.existsByJoinCode(generatedCode)); // Company 테이블에 존재하는지 확인

        return generatedCode;
    }

    public String generateUniqueEmployeeId(String departmentName) {
        String deptCode = departmentCodeMap.getOrDefault(departmentName, "XX"); // 미등록 부서는 "XX" 처리
        LocalDate now = LocalDate.now();
        String prefix = "EM" + now.format(DateTimeFormatter.ofPattern("yyMM")) + deptCode;

        int sequence = 1;
        String employeeId;

        do {
            employeeId = String.format("%s%03d", prefix, sequence++);
        } while (userRepository.existsByEmployeeId(employeeId));

        return employeeId;
    }
}