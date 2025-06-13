package kr.co.workie.service;

import kr.co.workie.dto.UserDTO;
import kr.co.workie.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface UserService {

    public String register(UserDTO userDTO);

    public UserDTO findById(String id);

    public UserDTO modify(UserDTO userDTO);

    //public TermsDTO terms();


    // 현재 사용자 정보 조회 (채팅용)
    public UserDTO getCurrentUser();

    // 멤버 선택을 위한 사용자 목록 조회 (채팅용)
    public List<UserDTO> getAvailableMembers();

    // 특정 사용자 정보 조회 (채팅용)
    public UserDTO getUserById(String userId);

    User getUserByUid(String uid);
}
