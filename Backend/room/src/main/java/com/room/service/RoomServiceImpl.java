package com.room.service;

import com.room.entity.Room;
import com.room.model.RoomDTO;
import com.room.repository.RoomRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RoomServiceImpl implements RoomService {
    private static final String UPLOAD_DIR = "Uploads/";
    private static final Logger logger = LoggerFactory.getLogger(RoomServiceImpl.class);

    @Autowired
    private final RoomRepository roomRepository;

    @Autowired
    private final ModelMapper modelMapper;

    public RoomServiceImpl(RoomRepository roomRepository, ModelMapper modelMapper) {
        this.roomRepository = roomRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public RoomDTO addRoom(RoomDTO roomDTO) {
        logger.info("Adding new room: {}", roomDTO);
        Room room = modelMapper.map(roomDTO, Room.class);
        Room savedRoom = roomRepository.save(room);
        logger.info("Room saved successfully with ID: {}", savedRoom.getRoomId());
        return modelMapper.map(savedRoom, RoomDTO.class);
    }

    @Override
    public RoomDTO getRoomById(Long id) {
        logger.info("Fetching room by ID: {}", id);
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Room not found with ID: {}", id);
                    return new RuntimeException("Room not found");
                });
        return modelMapper.map(room, RoomDTO.class);
    }

    @Override
    public List<RoomDTO> getRoomsByHotel(Long hotelId) {
        logger.info("Fetching rooms for hotel ID: {}", hotelId);
        return roomRepository.findByHotelId(hotelId).stream()
                .map(room -> modelMapper.map(room, RoomDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<RoomDTO> getAllRooms() {
        logger.info("Fetching all rooms");
        return roomRepository.findAll().stream()
                .map(room -> modelMapper.map(room, RoomDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public RoomDTO updateRoom(Long id, RoomDTO roomDTO) {
        logger.info("Updating room with ID: {}", id);
        Room existingRoom = roomRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Room not found for update with ID: {}", id);
                    return new RuntimeException("Room not found");
                });
        modelMapper.map(roomDTO, existingRoom);
        Room updatedRoom = roomRepository.save(existingRoom);
        logger.info("Room updated successfully: {}", updatedRoom);
        return modelMapper.map(updatedRoom, RoomDTO.class);
    }

    @Override
    public boolean deleteRoomById(Long id) {
        logger.info("Deleting room with ID: {}", id);
        roomRepository.deleteById(id);
        logger.info("Room deleted successfully");
        return true;
    }

    @Override
    public boolean deleteAllRooms() {
        logger.info("Deleting all rooms");
        roomRepository.deleteAll();
        logger.info("All rooms deleted successfully");
        return true;
    }

    @Override
    @Transactional
    public boolean deleteAllRoomsByHotelId(Long hotelId) {
        logger.info("Deleting all rooms for hotel ID: {}", hotelId);
        roomRepository.deleteByHotelId(hotelId);
        logger.info("Rooms deleted for hotel ID: {}", hotelId);
        return true;
    }

    @Override
    public String storeImage(MultipartFile file) {
        logger.info("Storing image: {}", file.getOriginalFilename());
        try {
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                boolean created = uploadDir.mkdirs();
                logger.info("Created upload directory: {}", uploadDir.getAbsolutePath());
            }

            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR, filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            logger.info("Image stored at: {}", filePath.toAbsolutePath());

            return "http://localhost:8082/uploads/" + filename;
        } catch (IOException e) {
            logger.error("Failed to store image", e);
            throw new RuntimeException("Failed to store image", e);
        }
    }
}
