package kr.co.workie.repository;

import kr.co.workie.entity.Calendar;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CalendarRepository extends JpaRepository<Calendar, Integer> {
    List<Calendar> findAllByWriter(String writer);


    Page<Calendar> findByWriterOrderByStartDateAsc(String loginId, Pageable pageable);
}
