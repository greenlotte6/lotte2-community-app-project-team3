package kr.co.workie.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardDTO {
    private int ano;

    private String category;
    private String writer;
    private String ability;
    private String master;
    private String title;
    private String content;
    private String comments;
    private String file1;
    private String file2;
    private String image1;
    private String image2;
    private String views;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
    private LocalDateTime wDate;

    @JsonProperty("pinned")
    private boolean pinned;

    @JsonProperty("commented")
    private boolean commented;

    //@JsonProperty("shared")
    //private boolean isShared;
}
