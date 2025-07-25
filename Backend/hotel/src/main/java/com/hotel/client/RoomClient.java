package com.hotel.client;

import com.hotel.model.RoomDTO; // This DTO should be defined in hotel-service, mirroring room-service's RoomDTO
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping; // Import DeleteMapping
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "room-service", url = "http://localhost:8082") // Ensure this URL is correct for your Room Service
public interface RoomClient {

    @GetMapping("/api/rooms/hotel/{hotelId}")
    List<RoomDTO> getRoomsByHotel(@PathVariable("hotelId") Long hotelId);

    // FIX: Added @DeleteMapping annotation here!
    @DeleteMapping("/api/rooms/deleteByHotel/{hotelId}")
    void deleteAllRoomsByHotelId(@PathVariable("hotelId") Long hotelId);
}