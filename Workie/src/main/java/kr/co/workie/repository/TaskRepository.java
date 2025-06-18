package kr.co.workie.repository;


import kr.co.workie.entity.Task;
import kr.co.workie.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProjectIdOrderByCreatedAtDesc(Long projectId);

    List<Task> findByProjectIdAndStatus(Long projectId, TaskStatus status);

    @Query("SELECT t FROM Task t WHERE t.project.id = :projectId AND t.assignee = :assignee")
    List<Task> findByProjectIdAndAssignee(@Param("projectId") Long projectId, @Param("assignee") String assignee);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId AND t.status = :status")
    Long countByProjectIdAndStatus(@Param("projectId") Long projectId, @Param("status") TaskStatus status);
}