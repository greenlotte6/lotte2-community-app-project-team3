package kr.co.workie.service;

import kr.co.workie.dto.UserDTO;

public interface UserService {


    public String register(UserDTO userDTO);

    public UserDTO findById(String id);

    public UserDTO modify(UserDTO userDTO);

    //public TermsDTO terms();
}
