package com.tracevia.sos.backend_sos.domain.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "calls")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")

public class Call {

    @Id
    @GeneratedValue
    private UUID id;
    @ManyToOne
    private User caller;
    @ManyToOne
    private User callee;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;


    public Call(UUID id, User caller, User callee, LocalDateTime startTime, String status) {
        this.id = id;
        this.caller = caller;
        this.callee = callee;
        this.startTime = startTime;
        this.status = status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

}
