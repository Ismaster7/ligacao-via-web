package com.tracevia.sos.backend_sos.domain.entities;

import jakarta.persistence.*;
import lombok.*;



@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Builder

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String sipNumber;
    private String password;
    private String name;

    public User(Long id){
        this.id = id;
    }

}
