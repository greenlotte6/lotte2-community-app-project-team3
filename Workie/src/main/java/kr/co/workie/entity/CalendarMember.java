package kr.co.workie.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "CalendarMember")
public class CalendarMember {
    @Id
    private int mno;

    private String userId;
    private int cno; //parentId
    private String role;
}
