package com.tracevia.sos.backend_sos.infraestructure.repository.interfaces;

import com.tracevia.sos.backend_sos.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IUserRepository extends JpaRepository<User, Long> {

}
