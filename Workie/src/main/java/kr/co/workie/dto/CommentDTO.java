package kr.co.workie.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentDTO {
    private int cno;
    private int ano;
    private String writer;
    private String content;
    private String regDate;
}
