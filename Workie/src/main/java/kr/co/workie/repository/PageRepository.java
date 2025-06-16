package kr.co.workie.repository;

import kr.co.workie.dto.PageDTO;
import kr.co.workie.entity.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PageRepository extends JpaRepository<Page, Integer> {
    List<Page> findAllByWriter(String loginId);

    int countByWriter(String writer);

    List<Page> findTop3ByWriterOrderByModDateDesc(String loginId);

    List<Page> findByWriterAndParentPage(String loginId, int i);

    //List<PageDTO> findByWriterAndFavoriteTrue(String loginId);

    //List<PageDTO> findByWriterAndSharedTrue(String loginId);

    //int countByWriterAndDeletedTrue(String loginId);
}
