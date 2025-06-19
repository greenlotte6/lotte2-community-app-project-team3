package kr.co.workie.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "Company")
public class Company {
    private String tax;

    @Id
    private String ceoId;
    private String joinCode;
    private String companyName;

}
