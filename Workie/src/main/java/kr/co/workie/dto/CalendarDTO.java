package kr.co.workie.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CalendarDTO {
    private int cno;
    private String writer;
    private String title;
    private String description;
    private String startDate;
    private String endDate;
    private String allDay; //나중에 지울듯?
    private String backgroundColor;
    private Boolean isDeleted;

    public LocalDateTime getParsedStartDate() {
        if(this.startDate != null && !this.startDate.isEmpty()) {
            return null;
        }
        return LocalDateTime.parse(this.startDate, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }

    public LocalDateTime getParsedEndDate() {
        if(this.endDate != null && !this.endDate.isEmpty()) {
            return null;
        }
        return LocalDateTime.parse(this.endDate, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }

}
