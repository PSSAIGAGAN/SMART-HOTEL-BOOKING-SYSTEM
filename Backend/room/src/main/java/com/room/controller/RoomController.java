package com.room.controller;

import com.room.model.RoomDTO;
import com.room.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @PostMapping("/create")
    public ResponseEntity<RoomDTO> addRoom(@RequestBody RoomDTO roomDTO) {
        return ResponseEntity.ok(roomService.addRoom(roomDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomDTO> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<RoomDTO>> getRoomsByHotel(@PathVariable Long hotelId) {
        return ResponseEntity.ok(roomService.getRoomsByHotel(hotelId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<RoomDTO>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<RoomDTO> updateRoom(@PathVariable Long id, @RequestBody RoomDTO roomDTO) {
        return ResponseEntity.ok(roomService.updateRoom(id, roomDTO));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> deleteRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.deleteRoomById(id));
    }

    @DeleteMapping("/deleteAll")
    public ResponseEntity<Boolean> deleteAllRooms() {
        return ResponseEntity.ok(roomService.deleteAllRooms());
    }

    // New endpoint for deleting rooms by hotel ID
    @DeleteMapping("/deleteByHotel/{hotelId}")
    public ResponseEntity<Boolean> deleteAllRoomsByHotelId(@PathVariable Long hotelId) {
        return ResponseEntity.ok(roomService.deleteAllRoomsByHotelId(hotelId));
    }

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("image") MultipartFile file) {
        String imageUrl = roomService.storeImage(file);
        return ResponseEntity.ok(Map.of("url", imageUrl));
    }
}