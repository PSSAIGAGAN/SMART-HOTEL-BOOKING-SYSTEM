package com.room.controller;

import com.room.model.RoomDTO;
import com.room.service.RoomService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class RoomControllerTest {

    @Mock
    private RoomService roomService;

    @InjectMocks
    private RoomController roomController;

    private RoomDTO sampleRoom;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        sampleRoom = new RoomDTO();
        sampleRoom.setRoomId(101L);
        sampleRoom.setHotelId(1L);
        sampleRoom.setRoomId(101L);
        sampleRoom.setType("Deluxe");
    }

    @Test
    void testAddRoom() {
        when(roomService.addRoom(any(RoomDTO.class))).thenReturn(sampleRoom);

        ResponseEntity<RoomDTO> response = roomController.addRoom(sampleRoom);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(sampleRoom, response.getBody());
    }

    @Test
    void testGetRoomById() {
        when(roomService.getRoomById(101L)).thenReturn(sampleRoom);

        ResponseEntity<RoomDTO> response = roomController.getRoomById(101L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(sampleRoom, response.getBody());
    }

    @Test
    void testGetRoomsByHotel() {
        List<RoomDTO> rooms = Arrays.asList(sampleRoom);
        when(roomService.getRoomsByHotel(1L)).thenReturn(rooms);

        ResponseEntity<List<RoomDTO>> response = roomController.getRoomsByHotel(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(rooms, response.getBody());
    }

    @Test
    void testGetAllRooms() {
        List<RoomDTO> rooms = Arrays.asList(sampleRoom);
        when(roomService.getAllRooms()).thenReturn(rooms);

        ResponseEntity<List<RoomDTO>> response = roomController.getAllRooms();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(rooms, response.getBody());
    }

    @Test
    void testUpdateRoom() {
        RoomDTO updatedRoom = new RoomDTO();
        updatedRoom.setHotelId(101L);
        updatedRoom.setRoomId(102L);
        updatedRoom.setType("Suite");
        updatedRoom.setHotelId(1L);

        when(roomService.updateRoom(eq(101L), any(RoomDTO.class))).thenReturn(updatedRoom);

        ResponseEntity<RoomDTO> response = roomController.updateRoom(101L, updatedRoom);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(updatedRoom, response.getBody());
    }

    @Test
    void testDeleteRoomById() {
        when(roomService.deleteRoomById(101L)).thenReturn(true);

        ResponseEntity<Boolean> response = roomController.deleteRoomById(101L);

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody());
    }

    @Test
    void testDeleteAllRooms() {
        when(roomService.deleteAllRooms()).thenReturn(true);

        ResponseEntity<Boolean> response = roomController.deleteAllRooms();

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody());
    }
}
