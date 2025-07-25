package cts.rrms.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cts.rrms.entity.Review;
import cts.rrms.exception.ReviewIdIsNotFoundException;
import cts.rrms.exception.ReviewUpdateFailureException;
import cts.rrms.exception.ReviewNotFoundForUserException; // New exception for user-related cases
import cts.rrms.model.ReviewDto;
import cts.rrms.repository.ReviewRepository;


@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ModelMapper modelMapper;
    

    
    @Override
    public ReviewDto addReview(ReviewDto reviewDto) {
        Review review = modelMapper.map(reviewDto, Review.class);
        review.setTimestamp(LocalDateTime.now()); // Ensure timestamp is set
        Review resultEntity = reviewRepository.save(review);
        return modelMapper.map(resultEntity, ReviewDto.class);
    }
//    @Override
//    public List<ReviewDto> getAllReviews() {
//        List<Review> all = reviewRepository.findAll();
//        return all.stream()
//                  .map(review -> modelMapper.map(review, ReviewDto.class))
//                  .collect(Collectors.toList());
//    }
    @Override
    public List<ReviewDto> getAllReviewsByHotelId(Long hotelId) {
        List<Review> byHotel = reviewRepository.findByHotelId(hotelId);
        return byHotel.stream()
                      .map(review -> modelMapper.map(review, ReviewDto.class))
                      .collect(Collectors.toList());
    }





    @Override
    public ReviewDto updateReview(ReviewDto reviewDto) {
        if (reviewRepository.existsById(reviewDto.getReviewId())) {
            Review review = modelMapper.map(reviewDto, Review.class);

            // Fallback timestamp if DTO doesn't supply it
            if (review.getTimestamp() == null) {
                review.setTimestamp(LocalDateTime.now());
            }

            Review updated = reviewRepository.save(review);
            return modelMapper.map(updated, ReviewDto.class);
        } else {
            throw new ReviewUpdateFailureException("Review ID does not exist for update.");
        }
    }

    @Override
    public ReviewDto replyToReview(int reviewId, String reply) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ReviewIdIsNotFoundException("Review ID not found: " + reviewId));
 
        if (review.getManagerReply() != null && !review.getManagerReply().isBlank()) {
            throw new IllegalStateException("Reply already exists for review ID: " + reviewId);
        }
 
        review.setManagerReply(reply);
        Review updated = reviewRepository.save(review);
        return modelMapper.map(updated, ReviewDto.class);
    }
 
    
    @Override
    public List<ReviewDto> getAllReviews() {
        List<Review> all = reviewRepository.findAll();
        return all.stream()
                  .map(review -> modelMapper.map(review, ReviewDto.class))
                  .collect(Collectors.toList());
    }
    
    @Override
    public Double getAverageRatingByHotelId(Long hotelId) {
        List<Review> reviews = reviewRepository.findByHotelId(hotelId); //
        if (reviews.isEmpty()) {
            return 0.0; // Return 0 if no reviews exist for the hotel
        }
        double sumOfRatings = reviews.stream()
                                     .mapToInt(Review::getRating) //
                                     .sum();
        return sumOfRatings / reviews.size();
    }

    @Override
    public void deleteReviewById(int reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new ReviewIdIsNotFoundException("Review ID " + reviewId + " not found.");
        }
        reviewRepository.deleteById(reviewId);
    }





}
