package cts.urms.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.management.relation.Role;

import static org.mockito.ArgumentMatchers.nullable;
import org.assertj.core.util.Arrays;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import cts.urms.controller.UserController;
import cts.urms.entity.Roles;
import cts.urms.entity.User;
import cts.urms.exception.UserIdIsNotFoundException;
import cts.urms.model.UserDto;
import cts.urms.repository.UserRepository;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
	
	@Mock
	private UserRepository userRepository;
	
	@Mock
	private ModelMapper modelMapper;
	
	@Mock
	private PasswordEncoder passwordEncoder;
	
	@InjectMocks
	private UserServiceImpl userService;
	
	@InjectMocks
	private UserController userController;
	
	@BeforeEach
	void setUp1() {
		MockitoAnnotations.openMocks(this);
	}
	
	private UserDto userDto;
	private User user;
	
	@BeforeEach
	public void setUp() {
		
		Roles r1 =Roles.builder().roleId(0).roleName("USER").build(); 
		  Roles r2 =Roles.builder().roleId(0).roleName("ADMIN").build();
	  
	  List<Roles> listOfRoles=new ArrayList<>(); 
	  listOfRoles.add(r1);
	  listOfRoles.add(r2); 
	  userDto=UserDto.builder()
			  .email("gagan@gamil.com") 
			  .contactNumber(879766767) 
			  .name("gagan")
	          .password(passwordEncoder.encode("gagan@456")) 
	          .roles(listOfRoles) 
	          .userId(765) 
	          .build();
	  user=User.builder()
			  .email("gagan@gamil.com") 
			  .contactNumber(879766767) 
			  .name("gagan")
	          .password(passwordEncoder.encode("gagan@456")) 
	          .roles(listOfRoles) 
	          .userId(765) 
	          .build();
		
	}
	
	
	  @Test 
	  void testAddUser() { 
		  
	 
	  Mockito.when(userRepository.save(user)).thenReturn(user);
	  Mockito.when(modelMapper.map(userDto, User.class)).thenReturn(user);
	  Mockito.when(modelMapper.map(user,  UserDto.class)).thenReturn(userDto);
	   
	  UserDto actual=userService.addUser(userDto);
	  
	  assertEquals("gagan",actual.getName());
	  }
	 

		
	  @Test 
	   void testGetUserById() { 
		   Mockito.when(userRepository.findById(anyInt())).thenReturn(Optional.of(user));
		   Mockito.when(modelMapper.map(user,  UserDto.class)).thenReturn(userDto);
		   
		   UserDto actuals=userService.getUserById(765);
		   assertEquals(765, actuals.getUserId());
		   assertEquals("gagan",user.getName());
		   
		   }
	  
	  @Test 
	   void testGetUserByIdThrowsException() { 
		   Mockito.when(userRepository.findById(anyInt())).thenThrow(UserIdIsNotFoundException.class);
		   assertThrows(UserIdIsNotFoundException.class,()->{
			   userService.getUserById(0);
		   });
		   }
	  
	  @Test 
	   void testGetUserByEmail() { 
		   Mockito.when(userRepository.findByEmail("gagan@gmail.com")).thenReturn(user);
		   Mockito.when(modelMapper.map(user,  UserDto.class)).thenReturn(userDto);
		   
		   
		   UserDto actuals=userService.getUserByEmail("gagan@gmail.com");
		   assertEquals("gagan",user.getName());
		   assertEquals(765,actuals.getUserId());
		   
		   }
	  
	  @Test 
	   void testGetUserByEmailThrowsException() { 
		   Mockito.when(userRepository.findByEmail("invalid@gmail.com")).thenThrow(UserIdIsNotFoundException.class);
		   assertThrows(UserIdIsNotFoundException.class,()->{
			   userService.getUserByEmail("invalid@gmail.com");
		   });
		   }
	  
		  
	   @Test 
	   void testDeleteUserById() { 
		   Mockito.when(userRepository.existsById(765)).thenReturn(true);
		   doNothing().when(userRepository).deleteById(765);
		   
		   String result=userService.deleteUserById(765);
		   assertEquals("user with id: 765 is deleted sucessfully",result);
		   
		   }
		  
	   @Test
	    void testUpdateUser() {
	        when(userRepository.existsById(765)).thenReturn(true);
	        when(userRepository.findById(765)).thenReturn(Optional.of(user));
	        when(userRepository.save(any(User.class))).thenReturn(user);
	        UserDto result = userService.updateUser(userDto);
	        assertNotNull(result);
	        assertEquals(765, result.getUserId());
	        assertEquals("gagan", result.getName());
	    }
		 
}
