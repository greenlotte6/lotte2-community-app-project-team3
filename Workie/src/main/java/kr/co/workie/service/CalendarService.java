package kr.co.workie.service;

import kr.co.workie.dto.CalendarDTO;
import kr.co.workie.dto.UserDTO;
import kr.co.workie.entity.Calendar;
import kr.co.workie.repository.CalendarRepository;
import kr.co.workie.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CalendarService {

    private final UserRepository userRepository;
    private final CalendarRepository calendarRepository;
    private final ModelMapper modelMapper;

    public int addEvent(String loginId, CalendarDTO calendarDTO){
        Calendar calendar = modelMapper.map(calendarDTO, Calendar.class);
        calendar.setWriter(loginId);

        Calendar savedEvent = calendarRepository.save(calendar);

        return savedEvent.getCno();
    }

    public String modify(){
        return null;
    }

    public UserDTO findByWriter(String writer) {
        Optional<Calendar> calendar = calendarRepository.findByWriter(writer);
        return null;
    }
}
