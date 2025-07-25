package cts.urms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import cts.urms.entity.User;

public interface UserRepository extends JpaRepository<User,Integer> {
	//JPQL Query
	//@Query("select u from User u where u.email=?1")
	
	//Sequel Query
	//@NativeQuery("select u from user u where u.email=?1")
	
	//select u from User u where u.email=myEmail
	public User findByEmail(String myEmail);
	
	@Query("SELECT u FROM User u JOIN u.roles r WHERE r.roleName = :roleName")
    List<User> findUsersByRoleName(@Param("roleName") String roleName);
	
}
