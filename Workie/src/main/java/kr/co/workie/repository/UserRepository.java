package kr.co.workie.repository;

import kr.co.workie.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    public boolean existsByEmployeeId(String employeeId);

    // 실제 존재하는 필드들로 메서드 추가
    Optional<User> findByEmployeeId(String employeeId);
    Optional<User> findByEmail(String email);
    Optional<User> findByName(String name);
    Optional<User> findById(String id);



    List<User> findByNameContainingIgnoreCase(String name);


    List<User> findByEmailContainingIgnoreCase(String email);

    List<User> findByJoinCode(String joinCode);
}