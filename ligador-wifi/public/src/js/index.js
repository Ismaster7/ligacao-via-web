// Configuração inicial do JsSIP
const socket = new JsSIP.WebSocketInterface('wss://raspberrypi.local:8089/ws');
const configuration = {
    uri: 'sip:1001@192.168.1.73', // URI do cliente
    password: '1234', // Senha do cliente
    sockets: [socket],
    register: true,
    session_timers: false,
};

// Criação do User Agent
const ua = new JsSIP.UA(configuration);

// Variável para armazenar a sessão atual
let currentSession = null;

// Função para iniciar uma chamada
function startCall() {
    if (currentSession) {
        console.log('Já existe uma chamada em andamento.');
        return;
    }

    const eventHandlers = {
        progress: function(e) {
            console.log('Chamada em progresso...');
        },
        failed: function(e) {
            console.log('Chamada falhou:', e.cause);
            currentSession = null;
            updateCallButton();
        },
        ended: function(e) {
            console.log('Chamada encerrada:', e.cause);
            currentSession = null;
            updateCallButton();
        },
        confirmed: function(e) {
            console.log('Chamada confirmada.');
        }
    };

    const options = {
        eventHandlers: eventHandlers,
        mediaConstraints: { audio: true, video: false },
        rtcOfferConstraints: {
            offerToReceiveAudio: true,
            offerToReceiveVideo: false
        }
    };

    // Solicita permissão para acessar o microfone
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then((stream) => {
            // Inicia a chamada para o atendente
            currentSession = ua.call('sip:1002@192.168.1.73', options)

            // Adiciona o stream local à chamada
            currentSession.connection.addEventListener('track', (event) => {
                const remoteStream = new MediaStream();
                remoteStream.addTrack(event.track);

                const remoteAudio = document.createElement('audio');
                remoteAudio.srcObject = remoteStream;
                remoteAudio.play();
            });

            updateCallButton();
        })
        .catch((error) => {
            console.error('Erro ao acessar o microfone:', error);
        });
}

// Função para encerrar a chamada atual
function endCall() {
    if (currentSession) {
        currentSession.terminate();
        currentSession = null;
        updateCallButton();
    } else {
        console.log('Nenhuma chamada em andamento para encerrar.');
    }
}

// Função para atualizar o texto do botão de chamada
function updateCallButton() {
    const callButton = document.querySelector("#sos-button");
    if (currentSession) {
        callButton.textContent = 'Desligar';
    } else {
        callButton.textContent = 'Chamar';
    }
}

// Evento de clique do botão de chamada
document.querySelector("#sos-button").addEventListener('click', () => {
    if (currentSession) {
        endCall();
    } else {
        startCall();
    }
});

// Inicia o User Agent
ua.start();
