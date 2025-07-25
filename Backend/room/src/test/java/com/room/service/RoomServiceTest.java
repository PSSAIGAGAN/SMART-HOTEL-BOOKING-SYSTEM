//package com.room.service;
//
//import com.room.entity.Room;
//import com.room.model.RoomDTO;
//import com.room.repository.RoomRepository;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.modelmapper.ModelMapper;
//
//import java.util.Arrays;
//import java.util.List;
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//class RoomServiceImplTest {
//
//    private RoomRepository roomRepository;
//    private ModelMapper modelMapper;
//    private RoomServiceImpl roomService;
//
//    private RoomDTO room;
//    private RoomDTO roomDTO;
//
//    @BeforeEach
//    void setUp() {
//        roomRepository = mock(RoomRepository.class);
//        modelMapper = mock(ModelMapper.class);
//        roomService = new RoomServiceImpl(roomRepository, modelMapper);
//
//        room = new RoomDTO();
//        room.setRoomId(101L);
//        room.setRoomId(1L);
//        room.setType("Deluxe");
//        room.setPrice(2500.0);
//        room.setAvailability(true);
//        room.setFeatures("Sea view, AC");
//
//        roomDTO = new RoomDTO();
//        roomDTO.setRoomId(101L);
//        roomDTO.setHotelId(1L);
//        roomDTO.setType("Deluxe");
//        roomDTO.setPrice(2500.0);
//        roomDTO.setAvailability(true);
//        roomDTO.setFeatures("Sea view, AC");
//    }
//
//    @Test
//    void testAddRoom() {
//        when(modelMapper.map(roomDTO, Room.class)).thenReturn(room);
//        when(roomRepository.save(room)).thenReturn(room);
//        when(modelMapper.map(room, RoomDTO.class)).thenReturn(roomDTO);
//
//        RoomDTO result = roomService.addRoom(roomDTO);
//
//        assertNotNull(result);
//        assertEquals("Deluxe", result.getType());
//
//        verify(roomRepository).save(room);
//    }
//
//    @Test
//    void testGetRoomById_found() {
//        when(roomRepository.findById(101L)).thenReturn(Optional.of(room));
//        when(modelMapper.map(room, RoomDTO.class)).thenReturn(roomDTO);
//
//        RoomDTO result = roomService.getRoomById(101L);
//
//        assertNotNull(result);
//        assertEquals(101L, result.getRoomId());
//    }
//
//    @Test
//    void testGetRoomById_notFound() {
//        when(roomRepository.findById(999L)).thenReturn(Optional.empty());
//
//        assertThrows(RuntimeException.class, () -> roomService.getRoomById(999L));
//    }
//
//    @Test
//    void testGetRoomsByHotel() {
//        List<Room> rooms = Arrays.asList(room);
//        when(roomRepository.findByHotel_HotelId(1L)).thenReturn(rooms);
//        when(modelMapper.map(room, RoomDTO.class)).thenReturn(roomDTO);
//
//        List<RoomDTO> result = roomService.getRoomsByHotel(1L);
//
//        assertEquals(1, result.size());
//        verify(roomRepository).findByHotel_HotelId(1L);
//    }
//
//    @Test
//    void testGetAllRooms() {
//        when(roomRepository.findAll()).thenReturn(Arrays.asList(room));
//        when(modelMapper.map(room, RoomDTO.class)).thenReturn(roomDTO);
//
//        List<RoomDTO> result = roomService.getAllRooms();
//
//        assertEquals(1, result.size());
//    }
//
//    @Test
//    void testUpdateRoom_success() {
//        RoomDTO updated = new RoomDTO();
//        updated.setRoomId(101L);
//        updated.setHotelId(1L);
//        updated.setType("Suite");
//        updated.setPrice(3200.0);
//        updated.setAvailability(false);
//        updated.setFeatures("Mountain view, Heater");
//
//        when(roomRepository.findById(101L)).thenReturn(Optional.of(room));
//        doAnswer(invocation -> {
//            RoomDTO src = invocation.getArgument(0);
//            room.setType(src.getType());
//            room.setPrice(src.getPrice());
//            room.setAvailability(src.getAvailability());
//            room.setFeatures(src.getFeatures());
//            return null;
//        }).when(modelMapper).map(updated, room);
//        when(roomRepository.save(room)).thenReturn(room);
//        when(modelMapper.map(room, RoomDTO.class)).thenReturn(updated);
//
//        RoomDTO result = roomService.updateRoom(101L, updated);
//
//        assertEquals("Suite", result.getType());
//        assertEquals(3200.0, result.getPrice());
//        assertFalse(result.getAvailability());
//    }
//
//    @Test
//    void testUpdateRoom_notFound() {
//        when(roomRepository.findById(404L)).thenReturn(Optional.empty());
//
//        assertThrows(RuntimeException.class, () -> roomService.updateRoom(404L, new RoomDTO()));
//    }
//
//    @Test
//    void testDeleteRoomById() {
//        doNothing().when(roomRepository).deleteById(101L);
//
//        boolean result = roomService.deleteRoomById(101L);
//
//        assertTrue(result);
//        verify(roomRepository).deleteById(101L);
//    }
//
//    @Test
//    void testDeleteAllRooms() {
//        doNothing().when(roomRepository).deleteAll();
//
//        boolean result = roomService.deleteAllRooms();
//
//        assertTrue(result);
//        verify(roomRepository).deleteAll();
//    }
//}
