package com.tracevia.sos.backend_sos.application.service;

import com.tracevia.sos.backend_sos.domain.entities.User;
import com.tracevia.sos.backend_sos.infraestructure.repository.interfaces.IUserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService  {
    private final IUserRepository userRepository;

    public UserService(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public User createUser(User user){
        return userRepository.save(user);
    }

    public Optional<User> getUserById(UUID id){
        return userRepository.findById(id);
    }

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }


}
