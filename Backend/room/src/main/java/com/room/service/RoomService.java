package com.room.service;

import com.room.model.RoomDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface RoomService {
    RoomDTO addRoom(RoomDTO roomDTO);
    RoomDTO getRoomById(Long id);
    List<RoomDTO> getRoomsByHotel(Long hotelId);
    List<RoomDTO> getAllRooms();
    RoomDTO updateRoom(Long id, RoomDTO roomDTO);
    boolean deleteRoomById(Long id);
    boolean deleteAllRooms();

    // New method for deleting all rooms associated with a hotel
    boolean deleteAllRoomsByHotelId(Long hotelId);

    String storeImage(MultipartFile file);
}