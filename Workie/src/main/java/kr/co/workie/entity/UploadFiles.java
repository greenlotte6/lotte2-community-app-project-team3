package kr.co.workie.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "UploadFiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UploadFiles {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fid;

    private String uuid;
    private String name;
    private String path;
    private LocalDateTime createdDate;
}