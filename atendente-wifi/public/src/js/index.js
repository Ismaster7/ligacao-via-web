const endCall = document.querySelector("#end-call")
const counterTime = document.querySelector("#counterTime")
let timer = null;
let acceptButton = document.querySelector(".accept")
let declineButton = document.querySelector(".decline")
const callReceiving = document.querySelector("#call-receiving")
const noCallReceiving = document.querySelector("#no-call-receiving")
let sipNumber = "1002";
let ipNumber = "192.168.1.73";
const configuration = initialWebSocketConfiguration()

main()


function main() {
    globalListener()
    enableOrDisableCalls()
}

function initialWebSocketConfiguration() {
    const socket = new JsSIP.WebSocketInterface('wss://raspberrypi.local:8089/ws');
    return {
        uri: `sip:${sipNumber}@${ipNumber}`,
        password: '1234',
        sockets: [socket],
        register: true,
        session_timers: false,
    };


}


function enableOrDisableCalls() {
    const ua = new JsSIP.UA(configuration);
    ua.on('registered', () => {
        console.log(`Registro bem sucedido como ${configuration.uri}`)
    })
    ua.on('newRTCSession', (e) => {

        const session = e.session
        acceptButton.addEventListener('click', () => {
            acceptCall(session);
            callReceivingFunction(false);
        });
        declineButton.addEventListener('click', () => {
            declineCall(session)
            callReceivingFunction(false);
        })

        session.on('accepted', (e) => {
            console.log('Call accepted');
            document.querySelector(".status").innerHTML = "Conectado";
            endCall.style.display = "block"
            timerStart()
        });

        session.on('confirmed', () => {
            console.log('Call confirmed');
        });
        session.on('canceled', (e) => {
            console.log("Call ended whith cause: ", e.cause)
            callReceivingFunction(false);
        })

        session.on('ended', (e) => {
            console.log('Call ended with cause:', e.cause);
            document.querySelector(".status").innerHTML = "Desconectado";
            endCall.style.display = "none"
            counterTime.innerHTML = ""
            clearInterval(timer); 
            counterTime.style.display = "none"
            
        });

        session.on('failed', (e) => {
            console.log('Call failed with cause:', e.cause);

        });
        session.on('rejected', (e) => {
            console.log('Call failed withoaaaa cause:', e.cause);

        });

        session.on('track', (event) => {
            const remoteStream = new MediaStream();
            event.streams.forEach(stream => {
                stream.getTracks().forEach(track => {
                    remoteStream.addTrack(track);
                });
            });

            const remoteAudio = document.createElement('audio');
            remoteAudio.srcObject = remoteStream;
            remoteAudio.play();
        });

        if (session.direction === 'incoming') {
            callReceivingFunction(true);

            console.log('Incoming call accepted');
        }
    });

    ua.start();



}
function timerStart() {
    counterTime.innerHTML = ""
    counterTime.style.display = "block"
    let [hours, minutes, seconds] = [0, 0, 0]
        if (timer !== null) {
            clearInterval(timer); // Evita múltiplos timers
        }
        timer = setInterval(updateTimer, 1000);

    function updateTimer() {
        seconds++;
        if (seconds === 60) {
          seconds = 0;
          minutes++;
          if (minutes === 60) {
            minutes = 0;
            hours++;
          }
        }
        counterTime.innerHTML = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
      }
      
      function pad(value) {
        return value.toString().padStart(2, '0');
      }
}
function callReceivingFunction(show) {
    callReceiving.style.display = show ? "flex" : "none";
    noCallReceiving.style.display = show ? "none" : "flex";
}
function removeListener() {
    callReceiving.removeEventListener('click')
    noCallReceiving.removeEventListener('click')
}
function declineCall(session) {
    console.log("Session a ser queimada: ", session)
    session.terminate();
}
function acceptCall(session) {
    const eventHandlers = {
        progress: function (e) {
            console.log('Chamada em progresso...');
        },
        failed: function (e) {
            console.log('Chamada falhou:', e.cause);
            currentSession = null;
            updateCallButton();
        },
        ended: function (e) {
            console.log('Chamada encerrada:', e.cause);
            currentSession = null;
            updateCallButton();
        },
        confirmed: function (e) {
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
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then((stream) => {
            endCall.addEventListener("click", () => {
                session.terminate()
            })
            session.answer({
                mediaConstraints: { audio: true, video: false },
                mediaStream: stream,
            })
            session.connection.addEventListener('track', (event) => {
                const remoteStream = new MediaStream();
                remoteStream.addTrack(event.track);

                const remoteAudio = document.createElement('audio');
                remoteAudio.srcObject = remoteStream;
                remoteAudio.play();
            });

        })
        .catch((error) => {
            console.error('Erro ao acessar o microfone:', error);
        });
}

function globalListener() {

}



