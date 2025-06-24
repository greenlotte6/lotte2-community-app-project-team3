package kr.co.workie;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class WorkieApplication {

    public static void main(String[] args) {
        SpringApplication.run(WorkieApplication.class, args);
    }

}
