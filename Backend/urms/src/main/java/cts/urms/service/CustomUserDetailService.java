package cts.urms.service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import cts.urms.entity.Roles;
import cts.urms.entity.User;
import cts.urms.repository.UserRepository;

@Service
public class CustomUserDetailService implements UserDetailsService {

	@Autowired
	private UserRepository userRepository;


	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByEmail(username); // cts.kit@gmail.com
		if (user == null) {
			throw new UsernameNotFoundException("user email is not their in the db kindly register and try");
		}
		List<GrantedAuthority> listOfAuthorities = new ArrayList<GrantedAuthority>();
		for (Roles role : user.getRoles()) {
			SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role.getRoleName());
			listOfAuthorities.add(authority);
		}
		org.springframework.security.core.userdetails.User u = new org.springframework.security.core.userdetails.User(
				user.getEmail(), user.getPassword(), true, true, true, true, listOfAuthorities);
		return u;

	}
}