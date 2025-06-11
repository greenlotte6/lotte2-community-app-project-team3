package kr.co.workie.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalendarMemberDTO {
    private int mno;
    private String userId;
    private int cno; //parentId
    private String role;
}
