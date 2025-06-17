package kr.co.workie.security;

import kr.co.workie.entity.User;
import kr.co.workie.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class SecurityUserService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("loadUserByUsername...1 : " + username);

        Optional<User> result = userRepository.findById(username);
        log.info("loadUserByUsername...2 : " + result);

        if (result.isEmpty()) {
            log.info("loadUserByUsername...사용자 없음");
            throw new UsernameNotFoundException("해당 사용자가 존재하지 않습니다: " + username);
        }

        log.info("loadUserByUsername...3 : " + result.get());

        UserDetails userDetails = MyUserDetails.builder()
                .user(result.get())
                .build();

        log.info("loadUserByUsername...4 : " + userDetails);
        return userDetails;
    }
}
