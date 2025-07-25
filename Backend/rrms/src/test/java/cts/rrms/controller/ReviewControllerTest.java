//package cts.rrms.controller;
//
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
//
//import java.time.LocalDateTime;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
//
//import cts.rrms.exception.ReviewIdIsNotFoundException;
//import cts.rrms.exception.ReviewUpdateFailureException;
//import cts.rrms.model.ReviewDto;
//import cts.rrms.service.ReviewServiceImpl;
//
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.Mockito;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//
//@WebMvcTest(controllers = ReviewController.class)
//class ReviewControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private ReviewServiceImpl reviewService;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    private ReviewDto reviewDto;
//
//    @BeforeEach
//    void setup() {
//        objectMapper.registerModule(new JavaTimeModule());
//
//        reviewDto = ReviewDto.builder()
//                .reviewId(1)
//                .hotelId(101)
//                .rating(4)
//                .comment("Excellent stay")
//                .timestamp(LocalDateTime.now().minusDays(1))
//                .build();
//    }
//
//    @Test
//    void testAddReview() throws Exception {
//        Mockito.when(reviewService.addReview(Mockito.any(ReviewDto.class))).thenReturn(reviewDto);
//
//        mockMvc.perform(post("/review-api/reviews")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(objectMapper.writeValueAsString(reviewDto)))
//                .andDo(print());
//    }
//
//    @Test
//    void testGetReviewById() throws Exception {
////        Mockito.when(reviewService.getReviewById(1)).thenReturn(reviewDto);
//
//        mockMvc.perform(get("/review-api/reviews/1")
//                .accept(MediaType.APPLICATION_JSON))
//                .andDo(print());
//    }
//
////    @Test
////    void testGetReviewById_NotFound() throws Exception {
////        int nonExistentId = 999;
////        Mockito.when(reviewService.getReviewById(nonExistentId))
////               .thenThrow(new ReviewIdIsNotFoundException("Review ID: " + nonExistentId + " is not found."));
////
////        mockMvc.perform(get("/review-api/reviews/" + nonExistentId)
////                .accept(MediaType.APPLICATION_JSON))
////                .andDo(print());
////    }
//
//    @Test
//    void testUpdateReview() throws Exception {
//        Mockito.when(reviewService.updateReview(Mockito.any(ReviewDto.class))).thenReturn(reviewDto);
//
//        mockMvc.perform(put("/review-api/reviews")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(objectMapper.writeValueAsString(reviewDto)))
//                .andDo(print());
//    }
//
//    @Test
//    void testUpdateReview_NotFound() throws Exception {
//        Mockito.when(reviewService.updateReview(Mockito.any(ReviewDto.class)))
//               .thenThrow(new ReviewUpdateFailureException("Review ID " + reviewDto.getReviewId() + " does not exist for update."));
//
//        mockMvc.perform(put("/review-api/reviews")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(objectMapper.writeValueAsString(reviewDto)))
//                .andDo(print());
//    }
//
//    @Test
//    void testDeleteReview() throws Exception {
//        Mockito.when(reviewService.deleteReview(1)).thenReturn("Review with ID: 1 is deleted successfully.");
//
//        mockMvc.perform(delete("/review-api/reviews/1")
//                .accept(MediaType.APPLICATION_JSON))
//                .andDo(print());
//    }
//
//    @Test
//    void testDeleteReview_NotFound() throws Exception {
//        Mockito.when(reviewService.deleteReview(999)).thenReturn("Deletion failed due to non-existence of Review ID: 999.");
//
//        mockMvc.perform(delete("/review-api/reviews/999")
//                .accept(MediaType.APPLICATION_JSON))
//                .andDo(print());
//    }
//}
