package kr.co.workie.controller;


import kr.co.workie.dto.CreateProjectRequest;
import kr.co.workie.dto.ProjectDTO;
import kr.co.workie.entity.Project;
import kr.co.workie.entity.User;
import kr.co.workie.security.MyUserDetails;
import kr.co.workie.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public List<Project> getAllProjects(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            // 인증되지 않은 경우 처리 (예: 로그인 페이지로 리다이렉트 또는 401 Unauthorized 반환)
            // 여기서는 예시로 빈 리스트 반환
            return new ArrayList<>(); // 또는 throw new AccessDeniedException("User not authenticated");
        }

        // MyUserDetails 객체를 가져온 후, 그 안에서 실제 User 엔티티를 추출
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        String loginId = user.getId();
        return projectService.getAllProjects(loginId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProject(@PathVariable Long id) {
        ProjectDTO project = projectService.getProject(id);
        return ResponseEntity.ok(project);
    }

    @PostMapping("/create")
    public ResponseEntity<ProjectDTO> createProject(@Valid @RequestBody CreateProjectRequest request) {
        ProjectDTO project = projectService.createProject(request);
        return ResponseEntity.ok(project);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody CreateProjectRequest request) {
        ProjectDTO project = projectService.updateProject(id, request);
        return ResponseEntity.ok(project);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok().build();
    }
}

