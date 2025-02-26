package com.tracevia.sos.backend_sos.application.service;

import com.sun.nio.sctp.IllegalReceiveException;
import com.tracevia.sos.backend_sos.domain.entities.Call;
import com.tracevia.sos.backend_sos.domain.entities.User;
import com.tracevia.sos.backend_sos.infraestructure.repository.interfaces.ICallRepository;
import com.tracevia.sos.backend_sos.infraestructure.repository.interfaces.IUserRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service

public class CallService {
    private final ICallRepository callRepository;
    private final IUserRepository userRepository;
    private final AsteriskService asteriskService;

    public CallService(ICallRepository callRepository, IUserRepository userRepository, AsteriskService asteriskService) {
        this.asteriskService = asteriskService;
        this.callRepository = callRepository;
        this.userRepository = userRepository;
    }

    public Call startCall(Long callerId, Long calleeId) {
        User caller = userRepository.findById(callerId)
                .orElseThrow(() -> new RuntimeException("Caller not found"));

        User callee = userRepository.findById(calleeId)
                .orElseThrow(() -> new RuntimeException("Callee not found"));
       Call call = new Call(null, caller, callee, LocalDateTime.now(), "ACTIVE");
       Call savedCall = callRepository.save(call);

       try{
           asteriskService.originateCall(caller.getSipNumber(), callee.getSipNumber());
       }catch(IOException e){
           throw new RuntimeException("Erro ao iniciar chamada no asterisk  ");
       }
        return savedCall;
    }

    public Call endCall(Long callId){
        Optional<Call> callOptional = callRepository.findById(callId);
        if(callOptional.isPresent()){
            Call call = callOptional.get();
            call.setEndTime(LocalDateTime.now());
            call.setStatus("ENDED");
            return callRepository.save(call);
        }else{
            throw new IllegalArgumentException("Call not found");
        }

    }

    public List<Call> getActiveCalls(){
        return callRepository.findAll();
    }

}
