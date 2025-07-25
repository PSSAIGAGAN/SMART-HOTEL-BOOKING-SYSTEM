package cts.rrms.exception;

public class ReviewNotFoundForUserException extends RuntimeException {
    public ReviewNotFoundForUserException(String message) {
        super(message);
    }
}
