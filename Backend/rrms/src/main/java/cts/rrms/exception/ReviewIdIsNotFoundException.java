package cts.rrms.exception;

public class ReviewIdIsNotFoundException extends RuntimeException {
    public ReviewIdIsNotFoundException(String msg) {
        super(msg);
    }
}