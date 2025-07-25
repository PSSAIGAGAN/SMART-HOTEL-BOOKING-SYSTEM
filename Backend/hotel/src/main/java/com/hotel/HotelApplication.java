package com.hotel;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.cloud.openfeign.EnableFeignClients; // Ensure this import is present
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients // This annotation is crucial for Feign Clients to work
public class HotelApplication {

    public static void main(String[] args) {
        SpringApplication.run(HotelApplication.class, args);
    }
    
 // ⭐ Configure RestTemplate for inter-service communication via Eureka
    @Bean
    @LoadBalanced // Essential for using service names like "REVIEW-SERVICE"
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

//    @Bean
//    public ModelMapper modelMapper() {
//        return new ModelMapper();
//    }
}