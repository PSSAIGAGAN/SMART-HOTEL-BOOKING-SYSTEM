package cts.urms.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class User {
	@Id
	@GeneratedValue(strategy= GenerationType.IDENTITY)
	private int userId;
	private String name;
	@Column(nullable = false, unique=true)
	private String email;
	private String password;
	@Column(nullable = false, unique=true)
	private long contactNumber;
	@OneToMany(cascade=CascadeType.ALL, fetch = FetchType.EAGER)
	private List<Roles> roles;

}
