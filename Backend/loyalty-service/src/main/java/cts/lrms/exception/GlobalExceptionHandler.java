package cts.lrms.exception;

import java.util.Date;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import cts.lrms.model.ApiException;
import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle LoyaltyAccountNotFoundException
    @ExceptionHandler(LoyaltyAccountNotFoundException.class)
    public ResponseEntity<ApiException> handleLoyaltyAccountNotFoundException(LoyaltyAccountNotFoundException e,
                                                                              HttpServletRequest request) {
        return buildErrorResponse(e, HttpStatus.NOT_FOUND, request);
    }

    // Handle InsufficientPointsException
    @ExceptionHandler(InsufficientPointsException.class)
    public ResponseEntity<ApiException> handleInsufficientPointsException(InsufficientPointsException e,
                                                                          HttpServletRequest request) {
        return buildErrorResponse(e, HttpStatus.BAD_REQUEST, request);
    }

    // Handle RedemptionNotFoundException
    @ExceptionHandler(RedemptionNotFoundException.class)
    public ResponseEntity<ApiException> handleRedemptionNotFoundException(RedemptionNotFoundException e,
                                                                          HttpServletRequest request) {
        return buildErrorResponse(e, HttpStatus.NOT_FOUND, request);
    }

    // Handle ResourceNotFoundException
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiException> handleResourceNotFoundException(ResourceNotFoundException e,
                                                                        HttpServletRequest request) {
        return buildErrorResponse(e, HttpStatus.NOT_FOUND, request);
    }

    // Handle LoyaltyException (Generic Loyalty Errors)
    @ExceptionHandler(LoyaltyException.class)
    public ResponseEntity<ApiException> handleLoyaltyException(LoyaltyException e,
                                                               HttpServletRequest request) {
        return buildErrorResponse(e, HttpStatus.BAD_REQUEST, request);
    }

    // Handle all other unexpected exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiException> handleGenericException(Exception e, HttpServletRequest request) {
        return buildErrorResponse(e, HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    // Utility method to build a structured error response
    private ResponseEntity<ApiException> buildErrorResponse(Exception e, HttpStatus status, HttpServletRequest request) {
        ApiException apiException = ApiException.builder()
                .code(status.value())
                .message(e.getMessage())
                .path(request.getRequestURI())
                .when(new Date())
                .build();

        return ResponseEntity.status(status).body(apiException);
    }
}
