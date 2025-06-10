package kr.co.workie.repository;

import kr.co.workie.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository extends JpaRepository<Company, String> {
    boolean existsByJoinCode(String generatedCode);
}
