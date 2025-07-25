package cts.urms.exception;

import java.util.Date;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import cts.urms.model.ApiException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestControllerAdvice
public class ApplicationGlobalException {
	@ExceptionHandler(exception = UserIdIsNotFoundException.class)
	public ApiException handleUserIdIsNotAvailable(UserIdIsNotFoundException e,
			HttpServletRequest request,HttpServletResponse response) {
		ApiException apiException=ApiException.builder().code(response.getStatus())
				.message(e.getMessage()).path(request.getRequestURI())
				.when(new Date()).build();
		return apiException;
	}
	
	@ExceptionHandler(exception = UserNotFoundException.class)
	public ApiException handleUserNotAvailable(UserNotFoundException e,
			HttpServletRequest request,HttpServletResponse response) {
		ApiException apiException=ApiException.builder().code(HttpStatus.NOT_FOUND.value())
				.message(e.getMessage()).path(request.getRequestURI())
				.when(new Date()).build();
		return apiException;
	}
	
	@ExceptionHandler(exception=UserUpdateFailureException.class)
	public ApiException handleUserIdIsNotAvailable(UserUpdateFailureException e,
			HttpServletRequest request,HttpServletResponse response) {
		ApiException apiException=ApiException.builder().code(response.getStatus())
				.message(e.getMessage()).path(request.getRequestURI())
				.when(new Date()).build();
		return apiException;
	}
	
	
	@ExceptionHandler(exception =  MethodArgumentNotValidException.class)
	public ApiException handleMethodArgumnetNotValidException(MethodArgumentNotValidException e,
			HttpServletRequest request,HttpServletResponse response) {
		List<FieldError> listFieldErrors=e.getFieldErrors();
		StringBuilder sb=new StringBuilder();
		for (FieldError fieldError : listFieldErrors) {
			sb.append(fieldError.getField()+" : "+fieldError.getDefaultMessage());
			sb.append(System.lineSeparator());
		}
		ApiException apiException=ApiException.builder().code(response.getStatus())
				.path(request.getRequestURI())
		.when(new Date()).message(sb.toString()).build();
		return apiException;
	}
}
