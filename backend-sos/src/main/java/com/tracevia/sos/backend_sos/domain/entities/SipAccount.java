package com.tracevia.sos.backend_sos.domain.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SipAccount {
    private Long id;
    private String sipNumber;
    private String password;
    private User user;

}
