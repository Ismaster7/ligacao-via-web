package com.tracevia.sos.backend_sos.presentation.controller;


import com.tracevia.sos.backend_sos.application.service.CallService;
import com.tracevia.sos.backend_sos.application.service.UserService;
import com.tracevia.sos.backend_sos.domain.entities.Call;
import com.tracevia.sos.backend_sos.domain.entities.User;
import com.tracevia.sos.backend_sos.infraestructure.repository.dtos.UserDto;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/calls")
public class CallController {
    private final CallService callService;
    private final UserService userService;

    public CallController(CallService callService, UserService userService) {
        this.callService = callService;
        this.userService = userService;
    }

    @PostMapping("/start")
    public ResponseEntity<Call> startCall(@RequestBody Long callerId, @RequestBody Long calleeId){
        User caller = new User(callerId);
        User callee = new User(calleeId);
        Call call = null;
        try {
            call = callService.startCall(callerId, calleeId);
        }catch(Exception e){
            return  ResponseEntity.status(400).body(call);
        }
        return ResponseEntity.status(HttpStatus.OK).body(call);
    }
    @PostMapping("/end/{callId}")
    public ResponseEntity<Call> endCall(@PathVariable(name = "callId") Long callId){
        Call call = callService.endCall(callId);
        return ResponseEntity.status(HttpStatus.OK).body(call);
    }
    @PostMapping("/registerUser")
    public ResponseEntity<User> registerUser(@RequestBody @Valid UserDto userDto){
        var user = new User();
        BeanUtils.copyProperties(userDto, user);
       // user.setId(UUID.randomUUID());
        try{
            var body = userService.createUser(user);

           return ResponseEntity.status(HttpStatus.CREATED).body(body);
        }catch(Exception e){
            return  ResponseEntity.status(400).body(user);
        }

    }
    @GetMapping("/active")
    public ResponseEntity<List<Call>>getActiveCalls(){
        List<Call> calls = callService.getActiveCalls();
        return ResponseEntity.status(HttpStatus.OK).body(calls);
    }

    @GetMapping("/get-free-sip")
    public ResponseEntity<Call> getFreeSipCalls(){
        return ResponseEntity.ok()
    }
}
