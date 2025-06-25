package kr.co.workie.repository;


import kr.co.workie.dto.ProjectDTO;
import kr.co.workie.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT p FROM Project p ORDER BY p.createdAt DESC")
    List<Project> findAllOrderByCreatedAtDesc();

    @Query("SELECT p FROM Project p WHERE p.name LIKE %:keyword% OR p.description LIKE %:keyword%")
    List<Project> findByKeyword(String keyword);

    List<Project> findAllByCreator(String loginId);
}