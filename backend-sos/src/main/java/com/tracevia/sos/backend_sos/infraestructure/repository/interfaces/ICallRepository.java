package com.tracevia.sos.backend_sos.infraestructure.repository.interfaces;

import com.tracevia.sos.backend_sos.domain.entities.Call;
import org.springframework.data.jpa.repository.JpaRepository;



public interface ICallRepository extends JpaRepository<Call, Long> {
   // List<Call> findByStatus(String status);
}
