package kr.co.workie.repository;

import kr.co.workie.entity.Board;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Board, Integer> {
    List<Board> findByCategory(String category, Pageable pageable);

    int countByPinnedTrue();

    List<Board> findByPinned(boolean pinned);
}
