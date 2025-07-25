package cts.lrms.config;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.cloud.openfeign.FeignClient;


import cts.lrms.model.UserDto;
@FeignClient(name = "USER-SERVICE")
public interface UserFeignCl {
	@GetMapping("/user-api/users/{userNumber}")
    UserDto getUserById(@PathVariable("userNumber") int userNumber);
 

 
		
	
}
