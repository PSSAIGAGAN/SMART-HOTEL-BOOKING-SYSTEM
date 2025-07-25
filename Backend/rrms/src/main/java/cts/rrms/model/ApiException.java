package cts.rrms.model; // Consider a more common package if this is used globally

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ApiException {
	private int code;      // HTTP status code (e.g., 404, 400, 500)
	private String message; // A descriptive error message
	private String path;    // The request URI that caused the error
	private Date when;      // Timestamp of when the error occurred
}