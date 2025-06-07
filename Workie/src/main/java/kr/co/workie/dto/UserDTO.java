package kr.co.workie.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class UserDTO {

    private String id;
    private String pass;
    private String ssn;
    private String tax;
    private String name;
    private String email;
    private String hp;
    private String role;
    private String position;
    private String office;
    private String zip;
    private String addr1;
    private String addr2;
    private String regDate;
    private String leaveDate;

    private String regip;
    private String sms;





}
