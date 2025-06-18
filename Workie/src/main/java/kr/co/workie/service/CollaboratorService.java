package kr.co.workie.service;


import kr.co.workie.dto.AddCollaboratorRequest;
import kr.co.workie.dto.CollaboratorDTO;
import kr.co.workie.entity.Project;
import kr.co.workie.entity.ProjectCollaborator;
import kr.co.workie.repository.ProjectCollaboratorRepository;
import kr.co.workie.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CollaboratorService {

    private final ProjectCollaboratorRepository collaboratorRepository;
    private final ProjectRepository projectRepository;

    public List<CollaboratorDTO> getCollaborators(Long projectId) {
        return collaboratorRepository.findByProjectId(projectId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CollaboratorDTO addCollaborator(Long projectId, AddCollaboratorRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("프로젝트를 찾을 수 없습니다."));

        // 이미 존재하는 협업자인지 확인
        if (collaboratorRepository.existsByProjectIdAndEmail(projectId, request.getEmail())) {
            throw new RuntimeException("이미 프로젝트에 참여중인 사용자입니다.");
        }

        ProjectCollaborator collaborator = new ProjectCollaborator();
        collaborator.setProject(project);
        collaborator.setName(request.getName());
        collaborator.setEmail(request.getEmail());
        collaborator.setRole(request.getRole());

        return convertToDTO(collaboratorRepository.save(collaborator));
    }

    @Transactional
    public void removeCollaborator(Long projectId, String email) {
        if (!collaboratorRepository.existsByProjectIdAndEmail(projectId, email)) {
            throw new RuntimeException("협업자를 찾을 수 없습니다.");
        }
        collaboratorRepository.deleteByProjectIdAndEmail(projectId, email);
    }

    private CollaboratorDTO convertToDTO(ProjectCollaborator collaborator) {
        CollaboratorDTO dto = new CollaboratorDTO();
        dto.setId(collaborator.getId());
        dto.setName(collaborator.getName());
        dto.setEmail(collaborator.getEmail());
        dto.setRole(collaborator.getRole());
        dto.setJoinedAt(collaborator.getJoinedAt());
        return dto;
    }
}