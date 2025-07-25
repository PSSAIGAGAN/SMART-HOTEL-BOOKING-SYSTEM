package cts.urms.controller;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import cts.urms.appconfig.JwtUtility;
import cts.urms.entity.User;
import cts.urms.model.LoginDto;
import cts.urms.model.UserDto;
import cts.urms.service.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/user-api")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtility jwtUtility;

    @PostMapping("/users")
    public UserDto addUser(@Valid @RequestBody UserDto userDto) {
        logger.info("Received request to add user with email: {}", userDto.getEmail());
        return userService.addUser(userDto);
    }

    @GetMapping("/allusers")
    public List<UserDto> getAllUsers() {
        logger.info("Fetching all users");
        return userService.getAllUsers();
    }

    @GetMapping("/usersbyemail/{email}")
    public UserDto getUserByEmail(@PathVariable("email") String email) {
        logger.info("Fetching user by email: {}", email);
        return userService.getUserByEmail(email);
    }

    @DeleteMapping(value = "/users/{userNumber}")
    public String deleteUserById(@PathVariable int userNumber) {
        logger.warn("Deleting user with ID: {}", userNumber);
        return userService.deleteUserById(userNumber);
    }

    @GetMapping(value = "/users/{userNumber}")
    public UserDto getUserById(@PathVariable int userNumber) {
        logger.info("Fetching user by ID: {}", userNumber);
        return userService.getUserById(userNumber);
    }

    @PutMapping(value = "/users")
    public UserDto updateUser(@Valid @RequestBody UserDto userDto) {
        logger.info("Updating user with email: {}", userDto.getEmail());
        return userService.updateUser(userDto);
    }
    
    @GetMapping("/hotel-managers")
    public List<UserDto> getHotelManagers() {
        logger.info("Fetching all hotel managers");
        // Ensure "HOTEL_MANAGER" matches the role_name in your database exactly
        return userService.getUsersByRole("HOTEL_MANAGER");
    }

    @PostMapping("/users/login")
    public String login(@RequestBody LoginDto login) {
        logger.info("Login attempt for email: {}", login.getUsername());

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(login.getUsername(), login.getPassword()));

        if (authentication.isAuthenticated()) {
            logger.info("Authentication successful for email: {}", login.getUsername());
            UserDto user = userService.getUserByEmail(login.getUsername());
            return jwtUtility.generateToken(user);
        } else {
            logger.warn("Authentication failed for email: {}", login.getUsername());
            throw new UsernameNotFoundException("Invalid user email and password request!");
        }
    }
}
