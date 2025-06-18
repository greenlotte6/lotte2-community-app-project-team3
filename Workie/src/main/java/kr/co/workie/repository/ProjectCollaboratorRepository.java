package kr.co.workie.repository;


import kr.co.workie.entity.ProjectCollaborator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectCollaboratorRepository extends JpaRepository<ProjectCollaborator, Long> {

    List<ProjectCollaborator> findByProjectId(Long projectId);

    @Query("SELECT pc FROM ProjectCollaborator pc WHERE pc.project.id = :projectId AND pc.email = :email")
    Optional<ProjectCollaborator> findByProjectIdAndEmail(@Param("projectId") Long projectId, @Param("email") String email);

    boolean existsByProjectIdAndEmail(Long projectId, String email);

    void deleteByProjectIdAndEmail(Long projectId, String email);
}
