package kr.co.workie.controller;


import kr.co.workie.dto.AddCollaboratorRequest;
import kr.co.workie.dto.CollaboratorDTO;
import kr.co.workie.service.CollaboratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/collaborators")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class CollaboratorController {

    private final CollaboratorService collaboratorService;

    @GetMapping
    public ResponseEntity<List<CollaboratorDTO>> getCollaborators(@PathVariable Long projectId) {
        List<CollaboratorDTO> collaborators = collaboratorService.getCollaborators(projectId);
        return ResponseEntity.ok(collaborators);
    }

    @PostMapping
    public ResponseEntity<CollaboratorDTO> addCollaborator(
            @PathVariable Long projectId,
            @Valid @RequestBody AddCollaboratorRequest request) {
        CollaboratorDTO collaborator = collaboratorService.addCollaborator(projectId, request);
        return ResponseEntity.ok(collaborator);
    }

    @DeleteMapping
    public ResponseEntity<Void> removeCollaborator(
            @PathVariable Long projectId,
            @RequestParam String email) {
        collaboratorService.removeCollaborator(projectId, email);
        return ResponseEntity.ok().build();
    }
}