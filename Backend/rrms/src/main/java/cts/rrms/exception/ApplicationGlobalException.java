package cts.rrms.exception;

import java.util.Date;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import cts.rrms.model.ApiException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestControllerAdvice
public class ApplicationGlobalException {

    @ExceptionHandler(ReviewIdIsNotFoundException.class)
    public ApiException handleReviewIdNotFound(ReviewIdIsNotFoundException e,
                                               HttpServletRequest request,
                                               HttpServletResponse response) {
        response.setStatus(HttpStatus.NOT_FOUND.value());
        return ApiException.builder()
                .code(response.getStatus())
                .message(e.getMessage())
                .path(request.getRequestURI())
                .when(new Date())
                .build();
    }

    @ExceptionHandler(ReviewUpdateFailureException.class)
    public ApiException handleReviewUpdateFailure(ReviewUpdateFailureException e,
                                                  HttpServletRequest request,
                                                  HttpServletResponse response) {
        response.setStatus(HttpStatus.BAD_REQUEST.value());
        return ApiException.builder()
                .code(response.getStatus())
                .message(e.getMessage())
                .path(request.getRequestURI())
                .when(new Date())
                .build();
    }

    /**
     * **NEW**: Handles exception when no reviews are found for a specific user.
     */
    @ExceptionHandler(ReviewNotFoundForUserException.class)
    public ApiException handleReviewNotFoundForUser(ReviewNotFoundForUserException e,
                                                    HttpServletRequest request,
                                                    HttpServletResponse response) {
        response.setStatus(HttpStatus.NOT_FOUND.value());
        return ApiException.builder()
                .code(response.getStatus())
                .message(e.getMessage())
                .path(request.getRequestURI())
                .when(new Date())
                .build();
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiException handleMethodArgumentNotValidException(MethodArgumentNotValidException e,
                                                              HttpServletRequest request,
                                                              HttpServletResponse response) {
        response.setStatus(HttpStatus.BAD_REQUEST.value());

        List<FieldError> listFieldErrors = e.getFieldErrors();
        StringBuilder sb = new StringBuilder();
        for (FieldError fieldError : listFieldErrors) {
            sb.append(fieldError.getField()).append(" : ").append(fieldError.getDefaultMessage());
            sb.append(System.lineSeparator());
        }

        return ApiException.builder()
                .code(response.getStatus())
                .path(request.getRequestURI())
                .when(new Date())
                .message(sb.toString())
                .build();
    }
}
