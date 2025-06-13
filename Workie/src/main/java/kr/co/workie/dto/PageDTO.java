package kr.co.workie.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
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

    @JsonProperty("deleted")
    private boolean isDeleted;

    @JsonProperty("favorite")
    private boolean isFavorite;

    @JsonProperty("shared")
    private boolean isShared;


}
