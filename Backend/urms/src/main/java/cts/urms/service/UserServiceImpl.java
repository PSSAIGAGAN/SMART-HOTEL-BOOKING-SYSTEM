package cts.urms.service;




import java.util.List;

import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;


import cts.urms.entity.User;
import cts.urms.exception.UserIdIsNotFoundException;
import cts.urms.exception.UserNotFoundException;
import cts.urms.exception.UserUpdateFailureException;
import cts.urms.model.UserDto;
import cts.urms.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService{
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private ModelMapper modelMapper;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Override
	public UserDto addUser(UserDto userDto) {
		System.out.println(userDto);
		userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
		User user=modelMapper.map(userDto, User.class);
		User resultEntity=userRepository.save(user);
		System.out.println(resultEntity);
		return modelMapper.map(resultEntity, UserDto.class);
	}
	
	@Override
	public UserDto getUserByEmail(String email) {
		User user = userRepository.findByEmail(email);
		if(user!=null) {
			return modelMapper.map(user, UserDto.class);
		}
		throw new UserNotFoundException("user is not found");
	}
	
@Override	
public UserDto getUserById(int userNumber) {
	UserDto userDto=null;
	Optional<User> optionalUser = userRepository.findById(userNumber);
	if(optionalUser.isEmpty()) {
		throw new UserIdIsNotFoundException("user id: "+userNumber+" is not there in the db");
		
	}else {
		userDto = modelMapper.map(optionalUser.get(), UserDto.class);
		
	}
	return userDto;
}

@Override	
public String deleteUserById(@PathVariable int userNumber) {
	String response=null;
	boolean result = userRepository.existsById(userNumber);
	if(result) {
		userRepository.deleteById(userNumber);
		response="user with id: "+userNumber+" is deleted sucessfully";
	}else {
		response="delete is failed due to non existence of user id: "+userNumber;
		
	}
	return response;
	
		
	}

@Override
public List<UserDto> getUsersByRole(String roleName) {
    List<User> users = userRepository.findUsersByRoleName(roleName);
    return users.stream()
                .map(user -> modelMapper.map(user, UserDto.class))
                .collect(Collectors.toList());
}

@Override
public List<UserDto> getAllUsers() {
    List<User> users = userRepository.findAll();
    return users.stream()
                .map(user -> modelMapper.map(user, UserDto.class))
                .toList();
}


@Override
public UserDto updateUser(UserDto userDto) {
    UserDto userDto2 = null;

    boolean result = userRepository.existsById(userDto.getUserId());
    if (result) {

        User existingUser = userRepository.findById(userDto.getUserId()).orElseThrow();

        existingUser.setName(userDto.getName());
        existingUser.setEmail(userDto.getEmail());
        existingUser.setContactNumber(userDto.getContactNumber());
        existingUser.setRoles(userDto.getRoles());


        if (userDto.getPassword() != null && !userDto.getPassword().isBlank()) {
            existingUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }


        User u = userRepository.save(existingUser);


        userDto2 = new UserDto();
        userDto2.setUserId(u.getUserId());
        userDto2.setName(u.getName());
        userDto2.setEmail(u.getEmail());
        userDto2.setContactNumber(u.getContactNumber());
        userDto2.setRoles(u.getRoles());

    } else {
        throw new UserUpdateFailureException("user id is not exists");
    }

    return userDto2;
}


}
