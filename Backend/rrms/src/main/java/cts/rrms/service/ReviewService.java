package cts.rrms.service;

import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;

import cts.rrms.model.ReviewDto;

public interface ReviewService  {
    
    ReviewDto addReview(ReviewDto reviewDto);


    ReviewDto updateReview(@RequestBody ReviewDto reviewDto);
    List<ReviewDto> getAllReviewsByHotelId(Long hotelId);
//    List<ReviewDto> getAllReviews(); // Add this to the interface
    List<ReviewDto> getAllReviews();
    void deleteReviewById(int reviewId);
    
    Double getAverageRatingByHotelId(Long hotelId);

    ReviewDto replyToReview(int reviewId, String reply);



    

}
