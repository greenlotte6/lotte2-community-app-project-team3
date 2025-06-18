package kr.co.workie.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollaboratorDTO {
    private Long id;
    private String name;
    private String email;
    private String role;
    private LocalDateTime joinedAt;
}