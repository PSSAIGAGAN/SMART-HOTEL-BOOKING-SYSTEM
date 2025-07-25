//package cts.rrms.service;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//import java.time.LocalDateTime;
//import java.util.Optional;
//
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import cts.rrms.entity.Review;
//import cts.rrms.model.ReviewDto;
//import cts.rrms.repository.ReviewRepository;
//
//@SpringBootTest
//class ReviewServiceTest {
//
//    @InjectMocks
//    private ReviewServiceImpl reviewService;
//
//    @Mock
//    private ReviewRepository reviewRepository;
//
//    @Mock
//    private org.modelmapper.ModelMapper modelMapper;
//
//    private Review reviewEntity;
//    private ReviewDto reviewDto;
//
//    @BeforeEach
//    void setUp() {
//        reviewEntity = new Review();
//        reviewEntity.setReviewId(1);
//        reviewEntity.setHotelId(101);
//        reviewEntity.setRating(3);
//        reviewEntity.setComment("No Comments");
//        reviewEntity.setTimestamp(LocalDateTime.now().minusDays(1));
//
//        reviewDto = ReviewDto.builder()
//                .reviewId(1)
//                .hotelId(101)
//                .rating(3)
//                .comment("No Comments")
//                .timestamp(LocalDateTime.now().minusDays(1))
//                .build();
//    }
//
//    @Test
//    void testAddReview() {
//        when(modelMapper.map(reviewDto, Review.class)).thenReturn(reviewEntity);
//        when(reviewRepository.save(reviewEntity)).thenReturn(reviewEntity);
//        when(modelMapper.map(reviewEntity, ReviewDto.class)).thenReturn(reviewDto);
//
//        ReviewDto savedReviewDto = reviewService.addReview(reviewDto);
//
//        assertNotNull(savedReviewDto);
//        assertEquals(reviewDto.getComment(), savedReviewDto.getComment());
//        assertEquals(reviewDto.getRating(), savedReviewDto.getRating());
//    }
//
//    @Test
//    void testGetReviewById() {
//        int reviewId = 1;
//        when(reviewRepository.findById(reviewId)).thenReturn(Optional.of(reviewEntity));
//        when(modelMapper.map(reviewEntity, ReviewDto.class)).thenReturn(reviewDto);
//
////        ReviewDto retrievedReviewDto = reviewService.getReviewById(reviewId);
//
////        assertNotNull(retrievedReviewDto);
////        assertEquals(reviewDto.getReviewId(), retrievedReviewDto.getReviewId());
////        assertEquals(reviewDto.getComment(), retrievedReviewDto.getComment());
//    }
//
//    @Test
//    void testUpdateReview() {
//        when(reviewRepository.existsById(reviewDto.getReviewId())).thenReturn(true);
//        when(modelMapper.map(reviewDto, Review.class)).thenReturn(reviewEntity);
//        when(reviewRepository.save(reviewEntity)).thenReturn(reviewEntity);
//        when(modelMapper.map(reviewEntity, ReviewDto.class)).thenReturn(reviewDto);
//
//        ReviewDto updatedReviewDto = reviewService.updateReview(reviewDto);
//
//        assertNotNull(updatedReviewDto);
//        assertEquals(reviewDto.getComment(), updatedReviewDto.getComment());
//        assertEquals(reviewDto.getRating(), updatedReviewDto.getRating());
//    }
//
//    @Test
//    void testDeleteReviewById() {
//        int reviewId = 1;
//        when(reviewRepository.existsById(reviewId)).thenReturn(true);
//        doNothing().when(reviewRepository).deleteById(reviewId);
//
//        String result = reviewService.deleteReview(reviewId);
//
//        assertNotNull(result);
//        assertTrue(result.contains("deleted successfully"));
//    }
//}
