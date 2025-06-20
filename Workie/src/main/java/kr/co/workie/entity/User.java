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
    @Getter(AccessLevel.NONE) // 👈 Lombok의 자동 getter 생성 막기
    private String role;       // 👇 아래에서 수동 getter 정의
    public String getRole() {
        if (role == null) return "ROLE_MEMBER";
        if (role.startsWith("ROLE_")) return role;
        return "ROLE_" + role;
    }

    private String position;
    private String office;
    private String department;
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

}
