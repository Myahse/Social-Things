package com.socialthings;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class SocialThingsApplication {

    public static void main(String[] args) {
        SpringApplication.run(SocialThingsApplication.class, args);
    }
}
