package cts.urms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import cts.urms.entity.Roles;

public interface RolesRepository extends JpaRepository<Roles, Integer> {
	

}
