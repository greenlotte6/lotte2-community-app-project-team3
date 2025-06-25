package kr.co.workie.service;


import kr.co.workie.dto.CollaboratorDTO;
import kr.co.workie.dto.CreateProjectRequest;
import kr.co.workie.dto.ProjectDTO;
import kr.co.workie.entity.Project;
import kr.co.workie.entity.ProjectCollaborator;
import kr.co.workie.entity.TaskStatus;
import kr.co.workie.repository.ProjectCollaboratorRepository;
import kr.co.workie.repository.ProjectRepository;
import kr.co.workie.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectCollaboratorRepository collaboratorRepository;
    private final TaskRepository taskRepository;
    private final ModelMapper modelMapper;

    public List<Project> getAllProjects(String loginId) {
        List<Project> projectList = projectRepository.findAllByCreator(loginId);

        return projectList.stream()
                .map(project -> modelMapper.map(project, Project.class))
                .collect(Collectors.toList());
    }

    public ProjectDTO getProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("프로젝트를 찾을 수 없습니다."));
        return convertToDTO(project);
    }

    @Transactional
    public ProjectDTO createProject(CreateProjectRequest request) {
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setType(request.getType());

        Project savedProject = projectRepository.save(project);

        // 협업자 추가
        if (request.getCollaboratorEmails() != null && !request.getCollaboratorEmails().isEmpty()) {
            for (String email : request.getCollaboratorEmails()) {
                ProjectCollaborator collaborator = new ProjectCollaborator();
                collaborator.setProject(savedProject);
                collaborator.setEmail(email);
                collaborator.setName(extractNameFromEmail(email));
                collaborator.setRole("MEMBER");
                collaboratorRepository.save(collaborator);
            }
        }

        return convertToDTO(savedProject);
    }

    @Transactional
    public ProjectDTO updateProject(Long id, CreateProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("프로젝트를 찾을 수 없습니다."));

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setType(request.getType());

        return convertToDTO(projectRepository.save(project));
    }

    @Transactional
    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new RuntimeException("프로젝트를 찾을 수 없습니다.");
        }
        projectRepository.deleteById(id);
    }

    private ProjectDTO convertToDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setType(project.getType());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());

        // 작업 상태별 카운트
        dto.setTodoCount(taskRepository.countByProjectIdAndStatus(project.getId(), TaskStatus.TODO));
        dto.setProgressCount(taskRepository.countByProjectIdAndStatus(project.getId(), TaskStatus.PROGRESS));
        dto.setReviewCount(taskRepository.countByProjectIdAndStatus(project.getId(), TaskStatus.REVIEW));
        dto.setDoneCount(taskRepository.countByProjectIdAndStatus(project.getId(), TaskStatus.DONE));

        // 협업자 목록
        List<CollaboratorDTO> collaborators = collaboratorRepository.findByProjectId(project.getId())
                .stream()
                .map(this::convertCollaboratorToDTO)
                .collect(Collectors.toList());
        dto.setCollaborators(collaborators);

        return dto;
    }

    private CollaboratorDTO convertCollaboratorToDTO(ProjectCollaborator collaborator) {
        CollaboratorDTO dto = new CollaboratorDTO();
        dto.setId(collaborator.getId());
        dto.setName(collaborator.getName());
        dto.setEmail(collaborator.getEmail());
        dto.setRole(collaborator.getRole());
        dto.setJoinedAt(collaborator.getJoinedAt());
        return dto;
    }

    private String extractNameFromEmail(String email) {
        return email.substring(0, email.indexOf("@"));
    }
}