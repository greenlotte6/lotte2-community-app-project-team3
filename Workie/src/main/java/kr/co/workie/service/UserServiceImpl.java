package kr.co.workie.service;


import kr.co.workie.dto.UserDTO;
import kr.co.workie.entity.Company;
import kr.co.workie.entity.User;
import kr.co.workie.repository.CompanyRepository;
import kr.co.workie.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final ModelMapper modelMapper;

    @Override
    public String register(UserDTO userDTO) {
        String encoded = passwordEncoder.encode(userDTO.getPass());
        userDTO.setPass(encoded);

        User user = modelMapper.map(userDTO, User.class);
        Company company = modelMapper.map(userDTO, Company.class);

        User savedUser = userRepository.save(user);

        // CEO일 경우에만 Company 정보 설정
        if ("CEO".equalsIgnoreCase(savedUser.getPosition())) {
            company.setCeoId(savedUser.getId());                  // CEO ID 설정
            company.setTax(savedUser.getTax());                   // CEO가 입력한 사업자 번호 복사
            company.setCompanyName(userDTO.getCompanyName());     // 회사 이름 설정

            companyRepository.save(company); // company 저장
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
