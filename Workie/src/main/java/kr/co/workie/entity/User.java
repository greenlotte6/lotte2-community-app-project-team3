package kr.co.workie.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Entity
@Table(name = "User")
public class User {

    @Id
    private String id;
    private String pass;
    private String ssn;
    private String tax;
    private String name;
    private String rating;
    private String employeeId;
    private String email;
    private String hp;
    // 이렇게 단순하게 두면 됨
    @Setter
    private String role;
    private String position;
    private String office;
    private String department;
    private String zip;
    private String addr1;
    private String addr2;
    private String image;
    private String joinCode;

    //추가필드?
    private String sms;
    private String provider;

    @Column(updatable = false)
    @CreationTimestamp
    private LocalDateTime regDate;

    private LocalDateTime leaveDate;


    // 사용자 권한 및 인가 설정을 hasRole() 메서드로 처리하기 위해 접두어 "ROLE_" 추가 
//    public String getRole() {
//        return "ROLE_"+role;
//    }


    public String getRole() {
        // 🔥 ROLE 중복 방지 로직 추가
        if (role == null) {
            return "ROLE_USER"; // 기본값
        }

        // 이미 ROLE_로 시작하면 그대로 반환
        if (role.startsWith("ROLE_")) {
            return role;
        }

        // ROLE_가 없으면 추가
        return "ROLE_" + role;
    }

}
