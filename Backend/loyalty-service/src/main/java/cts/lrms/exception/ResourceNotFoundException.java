package cts.lrms.exception;

public class ResourceNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1L; // Explicit declaration

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
