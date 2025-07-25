package cts.urms.service;



import java.util.List;

import cts.urms.model.UserDto;

public interface UserService {
	public UserDto addUser(UserDto userDto);
	public UserDto getUserByEmail(String email);
	public UserDto getUserById(int userNumber);
	public String deleteUserById(int userNumber);
	public UserDto updateUser(UserDto userDto);
	public List<UserDto> getAllUsers();
	public List<UserDto> getUsersByRole(String roleName);

}

