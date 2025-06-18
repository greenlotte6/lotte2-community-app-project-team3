package kr.co.workie.dto;


import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProjectRequest {
    @NotBlank(message = "프로젝트명은 필수입니다.")
    @Size(max = 100, message = "프로젝트명은 100자 이하여야 합니다.")
    private String name;

    @Size(max = 500, message = "설명은 500자 이하여야 합니다.")
    private String description;

    @NotBlank(message = "프로젝트 타입은 필수입니다.")
    private String type;

    private List<String> collaboratorEmails;
}