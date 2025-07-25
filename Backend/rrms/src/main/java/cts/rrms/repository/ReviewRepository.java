package cts.rrms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import cts.rrms.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    
    // New method to find reviews by userId
    List<Review> findByUserId(int userId);
    List<Review> findByHotelId(Long hotelId);

}
