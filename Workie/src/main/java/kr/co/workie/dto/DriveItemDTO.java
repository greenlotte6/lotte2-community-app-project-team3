package kr.co.workie.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriveItemDTO {
    private Long dno;
    private String name;
    private String type;
    private Long parentId;
    private Long size;
    private LocalDateTime createdAt;

}
