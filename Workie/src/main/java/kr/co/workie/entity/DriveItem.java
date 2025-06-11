package kr.co.workie.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "DriveItem")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriveItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dno;

    @Enumerated(EnumType.STRING)
    private fileType type;

    private String name;

    @ManyToOne
    private User user;

    private Long size;
    private Long parentId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum fileType {
        FILE,
        FOLDER
    }
}