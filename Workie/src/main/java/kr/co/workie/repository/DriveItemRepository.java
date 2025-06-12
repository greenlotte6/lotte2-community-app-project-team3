package kr.co.workie.repository;

import kr.co.workie.entity.DriveItem;
import kr.co.workie.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DriveItemRepository extends JpaRepository<DriveItem, Long> {
    List<DriveItem> findByUserAndParentId(User user, Long parentId);
}
