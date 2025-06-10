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
