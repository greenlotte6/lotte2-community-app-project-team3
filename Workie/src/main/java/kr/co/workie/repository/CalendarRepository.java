package kr.co.workie.repository;

import kr.co.workie.entity.Calendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CalendarRepository extends JpaRepository<Calendar, Integer> {
    Optional<Calendar> findByWriter(String writer);
}
