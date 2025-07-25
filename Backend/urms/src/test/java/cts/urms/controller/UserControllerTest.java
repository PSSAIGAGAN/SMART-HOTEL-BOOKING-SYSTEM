package cts.urms.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import cts.urms.entity.Roles;
import cts.urms.model.UserDto;
import cts.urms.service.UserServiceImpl;

public class UserControllerTest {

    @Mock
    private UserServiceImpl userService;

    @InjectMocks
    private UserController userController;

    private UserDto userDto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        List<Roles> roles = new ArrayList<>();
        roles.add(Roles.builder().roleId(1).roleName("USER").build());
        roles.add(Roles.builder().roleId(2).roleName("ADMIN").build());

        userDto = UserDto.builder()
                .userId(765)
                .name("gagan")
                .email("gagan@gamil.com")
                .password("encodedpassword")
                .contactNumber(879766767)
                .roles(roles)
                .build();
    }

    @Test
    void testAddUser() {
        when(userService.addUser(any(UserDto.class))).thenReturn(userDto);

        UserDto response = userController.addUser(userDto);

        assertNotNull(response);
        assertEquals("gagan", response.getName());
    }

    @Test
    void testGetUserByEmail() {
        when(userService.getUserByEmail("gagan@gamil.com")).thenReturn(userDto);

        UserDto response = userController.getUserByEmail("gagan@gamil.com");

        assertNotNull(response);
        assertEquals(765, response.getUserId());
    }

    @Test
    void testGetUserById() {
        when(userService.getUserById(765)).thenReturn(userDto);

        UserDto response = userController.getUserById(765);

        assertNotNull(response);
        assertEquals("gagan", response.getName());
    }

    @Test
    void testDeleteUserById() {
        when(userService.deleteUserById(765)).thenReturn("User deleted successfully");

        String response = userController.deleteUserById(765);

        assertEquals("User deleted successfully", response);
    }

    @Test
    void testUpdateUser() {
        when(userService.updateUser(any(UserDto.class))).thenReturn(userDto);

        UserDto response = userController.updateUser(userDto);

        assertNotNull(response);
        assertEquals("gagan@gamil.com", response.getEmail());
    }
}
