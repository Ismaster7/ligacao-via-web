package com.tracevia.sos.backend_sos.application.service;

import org.asteriskjava.manager.ManagerConnection;
import org.asteriskjava.manager.ManagerConnectionFactory;
import org.asteriskjava.manager.action.OriginateAction;
import org.asteriskjava.manager.response.ManagerResponse;
import org.springframework.stereotype.Service;

import java.io.IOException;


@Service
public class AsteriskService {

    private final ManagerConnection managerConnection;

    public AsteriskService() {
        ManagerConnectionFactory factory = new ManagerConnectionFactory("127.0.0.1", "tracevia","trcv1234");
        this.managerConnection = factory.createManagerConnection();
    }

    public void originateCall(String from, String to)throws IOException {
        try{
            managerConnection.login();

            OriginateAction originateAction = new OriginateAction();
            originateAction.setChannel("SIP/" + from);
            originateAction.setContext("default");
            originateAction.setExten(to);
            originateAction.setPriority(1);
            originateAction.setCallerId(from);
            originateAction.setTimeout(30000L);

            ManagerResponse response = managerConnection.sendAction(originateAction, 30000);
            System.out.println("Asterisk response: " + response.getResponse());

            managerConnection.logoff();


        }catch(Exception e){
            throw  new IOException("Erro ao iniciar chamada");
        }
    }
}
