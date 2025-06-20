package kr.co.workie.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "Board")
public class Board {

    @Id
    private int ano;

    private String category;
    private String writer;
    private String ability;
    private String master;
    private String title;
    private String content;
    private String comments;
    private String file1;
    private String file2;
    private String image1;
    private String image2;
    private String views;

    @CreationTimestamp
    private LocalDateTime wDate;


}
