package cts.shbs.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import cts.shbs.model.BookingDto;
import cts.shbs.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

}
