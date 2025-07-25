package com.room.repository;

import com.room.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional; // Import Transactional

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByHotelId(Long hotelId);

    // New method for deleting rooms by hotel ID
    @Transactional // Ensure this is transactional for delete operations
    void deleteByHotelId(Long hotelId);
}