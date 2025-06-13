package kr.co.workie.service;

import kr.co.workie.dto.DriveItemDTO;
import kr.co.workie.entity.DriveItem;
import kr.co.workie.entity.User;
import kr.co.workie.repository.DriveItemRepository;
import kr.co.workie.repository.UploadFilesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DriveService {

    private final DriveItemRepository driveItemRepository;
    private final UploadFilesRepository uploadFilesRepository;


    public List<DriveItemDTO> listDriveItems(User user, Long parentId) {
        return driveItemRepository.findByUserAndParentId(user, parentId).stream()
                .map(item -> new DriveItemDTO(
                        item.getDno(),
                        item.getName(),
                        item.getType().name(),
                        item.getParentId(),
                        item.getSize(),
                        item.getCreatedAt()
                )).toList();
    }

    public DriveItem createFolder(User user, String name, Long parentId) {
        DriveItem folder = DriveItem.builder()
                .user(user)
                .name(name)
                .type(DriveItem.fileType.FOLDER)
                .parentId(parentId)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return driveItemRepository.save(folder);
    }

    public void deleteDriveItem(Long dno) {
        driveItemRepository.deleteById(dno);
    }
}
