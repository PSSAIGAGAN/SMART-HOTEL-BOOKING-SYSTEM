package com.hotel.exception;

import com.hotel.model.ApiException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestControllerAdvice
public class ApplicationGlobalException {

    @ExceptionHandler(HotelNotFoundException.class)
    public ResponseEntity<ApiException> handleHotelNotFoundException(HotelNotFoundException e, HttpServletRequest request) {
        return buildErrorResponse(e, HttpStatus.NOT_FOUND, request);
    }

    

    // This is for generic runtime exceptions
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiException> handleRuntimeException(RuntimeException e, HttpServletRequest request) {
        return buildErrorResponse(e, HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    // Fallback for all uncaught exceptions 
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiException> handleGenericException(Exception e, HttpServletRequest request) {
        return buildErrorResponse(e, HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    // Utility method to build a structured error response (json)
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
