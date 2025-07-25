package cts.lrms.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class LoyaltyException extends RuntimeException {
    private static final long serialVersionUID = 1L; // Explicit declaration

    public LoyaltyException(String message) {
        super(message);
    }
}
