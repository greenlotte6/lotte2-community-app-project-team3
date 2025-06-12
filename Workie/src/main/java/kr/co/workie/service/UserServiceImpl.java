package kr.co.workie.service;

import kr.co.workie.dto.UserDTO;
import kr.co.workie.entity.Company;
import kr.co.workie.entity.User;
import kr.co.workie.repository.CompanyRepository;
import kr.co.workie.repository.UserRepository;
import kr.co.workie.util.GenerateCode;
import kr.co.workie.security.MyUserDetails; // 추가
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication; // 추가
import org.springframework.security.core.context.SecurityContextHolder; // 추가
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List; // 추가
import java.util.Optional;
import java.util.stream.Collectors; // 추가

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final ModelMapper modelMapper;
    private final GenerateCode generateCode;

    // 기존 메서드들...
    @Override
    public String register(UserDTO userDTO) {
        //비밀번호 암호화
        String encoded = passwordEncoder.encode(userDTO.getPass());
        userDTO.setPass(encoded);

        //DTO -> Entity 변환
        User user = modelMapper.map(userDTO, User.class);
        Company company = modelMapper.map(userDTO, Company.class);

        //사원번호 생성
        String department = user.getDepartment();
        String generatedEmployeeId = generateCode.generateUniqueEmployeeId(department);
        user.setEmployeeId(generatedEmployeeId);

        //User 저장
        User savedUser = userRepository.save(user);

        // CEO일 경우에만 Company 정보 설정
        if ("CEO".equalsIgnoreCase(savedUser.getPosition())) {
            company.setCeoId(savedUser.getId());
            company.setTax(savedUser.getTax());
            company.setCompanyName(userDTO.getCompanyName());

            // joinCode 생성
            String joinCode = generateCode.generateUniqueJoinCode();
            company.setJoinCode(joinCode);

            // company 저장
            companyRepository.save(company);
        }

        return savedUser.getId();
    }

    @Override
    public UserDTO findById(String id) {
        Optional<User> user = userRepository.findById(id);

        if (user.isPresent()) {
            return modelMapper.map(user.get(), UserDTO.class);
        }
        return null;
    }

    @Override
    public UserDTO modify(UserDTO userDTO) {
        if(userRepository.existsById(userDTO.getId())) {
            User user = modelMapper.map(userDTO, User.class);

            // 비밀번호 변경 요청이 있는 경우에만 암호화해서 저장
            if (userDTO.getPass() != null && !userDTO.getPass().isBlank()) {
                String encodedPassword = passwordEncoder.encode(userDTO.getPass());
                user.setPass(encodedPassword);
            } else {
                // 기존 비밀번호 유지 (DB에서 가져와서 설정)
                String currentPass = userRepository.findById(userDTO.getId())
                        .map(User::getPass)
                        .orElse(null);
                user.setPass(currentPass);
            }

            User savedUser = userRepository.save(user);
            return modelMapper.map(savedUser, UserDTO.class);
        }
        return null;
    }

    // ======== 채팅용 메서드들 추가 ========

    // 현재 로그인된 사용자 정보 가져오기 (private 메서드)
    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails userDetails = (MyUserDetails) auth.getPrincipal();
        return userDetails.getUser().getId();
    }

    private User getCurrentUserEntity() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails userDetails = (MyUserDetails) auth.getPrincipal();
        return userDetails.getUser();
    }

    // 현재 사용자 정보 조회 (채팅용)
    @Override
    public UserDTO getCurrentUser() {
        User currentUser = getCurrentUserEntity();
        return modelMapper.map(currentUser, UserDTO.class);
    }

    // 멤버 선택을 위한 사용자 목록 조회 (채팅용)
    @Override
    public List<UserDTO> getAvailableMembers() {
        String currentUserId = getCurrentUserId();

        // 모든 사용자 조회 (자신 제외)
        List<User> allUsers = userRepository.findAll();

        return allUsers.stream()
                .filter(user -> !user.getId().equals(currentUserId)) // 자신 제외
                .map(user -> modelMapper.map(user, UserDTO.class))
                .collect(Collectors.toList());
    }

    // 특정 사용자 정보 조회 (채팅용)
    @Override
    public UserDTO getUserById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + userId));

        return modelMapper.map(user, UserDTO.class);
    }

/*
    @Override
    public TermsDTO terms() {
        Optional<Terms> optTerms = termsRepository.findById(1);
        if (optTerms.isPresent()) {
            Terms terms = optTerms.get();
            TermsDTO termsDTO = modelMapper.map(terms, TermsDTO.class);
            return termsDTO;
        }
        return null;
    }
*/
}