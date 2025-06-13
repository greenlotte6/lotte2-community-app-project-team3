package kr.co.workie.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageDTO {
    private int pno;
    private String writer;
    private String title;
    private String content;
    private String regDate;
    private String modDate;
    private int parentPage;
    private boolean isDeleted;
}
