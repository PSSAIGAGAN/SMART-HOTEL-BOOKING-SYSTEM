package cts.lrms.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import jakarta.validation.constraints.*;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {

	@Positive
	private Integer userId;
	@NotBlank(message="name should not be empty enter the name")
	private String name;
	@Email(message="Email is invalid",regexp="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}")
	private String email;
	@NotBlank
	@Size(min=8,max=12)
	private String password;
	private long contactNumber;
	/* private List<Roles> roles; */
}

