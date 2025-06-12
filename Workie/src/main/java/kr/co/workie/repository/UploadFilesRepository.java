package kr.co.workie.repository;

import kr.co.workie.entity.DriveItem;
import kr.co.workie.entity.UploadFiles;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UploadFilesRepository extends JpaRepository<UploadFiles, Long> {
    List<UploadFiles> findByDriveItem(DriveItem driveItem);
}
