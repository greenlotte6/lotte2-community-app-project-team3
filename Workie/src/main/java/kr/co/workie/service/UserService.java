package kr.co.workie.service;

import kr.co.workie.dto.UserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;

public interface UserService {

    public String register(UserDTO userDTO);

    public UserDTO findById(String id);

    public UserDTO modify(UserDTO userDTO);

    //public TermsDTO terms();
}
