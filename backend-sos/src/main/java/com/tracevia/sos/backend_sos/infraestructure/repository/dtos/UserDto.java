package com.tracevia.sos.backend_sos.infraestructure.repository.dtos;



import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    private UUID id;

    private String sipNumber;

    private String password;
    private String name;
public UserDto(UUID id){
    this.id = id;
}

}
