package kr.co.workie.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "Page")
public class Page {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int pno;

    private String writer;
    private String title;
    private String content;

    @CreationTimestamp
    private LocalDateTime regDate;

    @CreationTimestamp
    private LocalDateTime modDate;

    private int parentPage;
    private boolean isDeleted;
    private boolean isFavorite;
    private boolean isShared;
}
