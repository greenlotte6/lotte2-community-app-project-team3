package kr.co.workie.config;

import lombok.Getter;
import lombok.Setter;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import kr.co.workie.dto.UserDTO;
import kr.co.workie.entity.User;

@Getter
@Setter
@Configuration
@EnableAspectJAutoProxy
public class RootConfig {


    @Bean
    public ModelMapper modelMapper(){

        ModelMapper modelMapper = new ModelMapper();

        modelMapper.getConfiguration()
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE)
                .setMatchingStrategy(MatchingStrategies.STRICT)
                .setFieldMatchingEnabled(true);

        // 🔥 여기서부터 추가 - User -> UserDTO 매핑 설정
        modelMapper.createTypeMap(User.class, UserDTO.class)
                .addMapping(User::getName, UserDTO::setName);  // name 필드 명시적 매핑

        return modelMapper;
    }

}
