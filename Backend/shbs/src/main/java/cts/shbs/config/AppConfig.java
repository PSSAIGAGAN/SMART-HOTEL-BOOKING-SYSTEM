package cts.shbs.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class AppConfig implements WebMvcConfigurer { // Implement WebMvcConfigurer

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    // Add this CORS configuration method
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Apply CORS to all endpoints in your Spring Boot app
                .allowedOrigins("http://localhost:5173") // <-- IMPORTANT: Replace with your frontend's exact URL (Vite default is 5173)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allow common HTTP methods
                .allowedHeaders("*") // Allow all headers
                .allowCredentials(true); // Allow sending cookies/authorization headers if your app uses them
    }
}