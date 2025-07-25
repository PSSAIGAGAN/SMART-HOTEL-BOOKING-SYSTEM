package cts.shbs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient; // <-- CHANGE THIS IMPORT
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient // <-- Use this instead
@EnableFeignClients
public class ShbsApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShbsApplication.class, args);
    }
}
