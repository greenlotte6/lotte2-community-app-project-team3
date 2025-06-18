package kr.co.workie.dto;


import kr.co.workie.entity.TaskPriority;
import kr.co.workie.entity.TaskStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTaskRequest {
    @NotBlank(message = "작업명은 필수입니다.")
    @Size(max = 200, message = "작업명은 200자 이하여야 합니다.")
    private String title;

    @Size(max = 1000, message = "작업 내용은 1000자 이하여야 합니다.")
    private String description;

    private TaskStatus status = TaskStatus.TODO;

    private TaskPriority priority = TaskPriority.MEDIUM;

    @Size(max = 100, message = "담당자명은 100자 이하여야 합니다.")
    private String assignee;

    @Size(max = 100, message = "담당자 이메일은 100자 이하여야 합니다.")
    private String assigneeEmail;
}