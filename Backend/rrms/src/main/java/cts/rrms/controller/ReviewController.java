package cts.rrms.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import cts.rrms.model.ReviewDto;
import cts.rrms.service.ReviewServiceImpl;
import jakarta.validation.Valid;
import java.util.List;

/*@CrossOrigin("http://localhost:5173")*/
@RestController
@RequestMapping("/review-api")
public class ReviewController {

    private static final Logger logger = LoggerFactory.getLogger(ReviewController.class);

    @Autowired
    private ReviewServiceImpl reviewService;

    @PostMapping(value = "/reviews")
    public ResponseEntity<ReviewDto> addReview(@Valid @RequestBody ReviewDto reviewDto) {
        logger.info("Received request to add review: {}", reviewDto);
        ReviewDto addedReview = reviewService.addReview(reviewDto);
        logger.debug("Review added successfully: {}", addedReview);
        return new ResponseEntity<>(addedReview, HttpStatus.CREATED);
    }

    @GetMapping("/reviews/hotel/{hotelId}")
    public ResponseEntity<List<ReviewDto>> getReviewsByHotelId(@PathVariable Long hotelId) {
        logger.info("Fetching reviews for hotel ID: {}", hotelId);
        List<ReviewDto> hotelReviews = reviewService.getAllReviewsByHotelId(hotelId);
        logger.debug("Fetched {} reviews for hotel ID: {}", hotelReviews.size(), hotelId);
        return new ResponseEntity<>(hotelReviews, HttpStatus.OK);
    }
    
    @GetMapping("/reviews/average-rating/hotel/{hotelId}")
    public ResponseEntity<Double> getAverageRatingForHotel(@PathVariable Long hotelId) {
        logger.info("Fetching average rating for hotel ID: {}", hotelId);
        Double averageRating = reviewService.getAverageRatingByHotelId(hotelId);
        logger.debug("Average rating for hotel ID {}: {}", hotelId, averageRating);
        return new ResponseEntity<>(averageRating, HttpStatus.OK);
    }

    @PutMapping(value = "/reviews/{reviewId}")
    public ReviewDto updateReview(@RequestBody ReviewDto reviewDto) {
        logger.info("Updating review: {}", reviewDto);
        return reviewService.updateReview(reviewDto);
    }
    @PutMapping("/reviews/{reviewId}/reply")
    public ResponseEntity<ReviewDto> replyToReview(
            @PathVariable int reviewId,
            @RequestBody String reply) {
        ReviewDto updated = reviewService.replyToReview(reviewId, reply);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }
 
 
    @GetMapping("/review")
    public ResponseEntity<List<ReviewDto>> getAllReviews() {
        logger.info("Fetching all reviews");
        List<ReviewDto> allReviews = reviewService.getAllReviews();
        return new ResponseEntity<>(allReviews, HttpStatus.OK);
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable int reviewId) {
        logger.info("Deleting review ID: {}", reviewId);
        reviewService.deleteReviewById(reviewId);
        return ResponseEntity.noContent().build(); // 204 No Content
    }



}
