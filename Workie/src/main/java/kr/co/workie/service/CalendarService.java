package kr.co.workie.service;

import kr.co.workie.dto.CalendarDTO;
import kr.co.workie.entity.Calendar;
import kr.co.workie.repository.CalendarRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CalendarService {

    private final CalendarRepository calendarRepository;
    private final ModelMapper modelMapper;

    //일정 등록하기
    @Transactional
    public int addEvent(String loginId, CalendarDTO calendarDTO){
        Calendar calendar = modelMapper.map(calendarDTO, Calendar.class);
        calendar.setWriter(loginId);

        Calendar savedEvent = calendarRepository.save(calendar);

        return savedEvent.getCno();
    }
    
    //일정 수정하기
    @Transactional
    public void updateEvent(int cno, CalendarDTO calendarDTO) {
        Calendar calendar = calendarRepository.findById(cno).get();
        
        //기존의 writer 유지
        String originalWriter = calendar.getWriter();

        modelMapper.map(calendarDTO, calendar);

        calendar.setWriter(originalWriter);
    }

    //일정 삭제하기
    
    
    //일정 불러오기
    public List<CalendarDTO> getEventsByWriter(String loginId) {
        List<Calendar> calendarList = calendarRepository.findAllByWriter(loginId);
        return calendarList.stream()
                .map(calendar -> modelMapper.map(calendar, CalendarDTO.class))
                .toList();
    }



}
