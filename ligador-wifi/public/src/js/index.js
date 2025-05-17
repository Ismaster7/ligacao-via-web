// Configuração inicial do JsSIP
let sipNumber;
let pass;
 let configuration;
 let dialpanacount = "800";
 let ua
let ipNumber = "www.homologacaotracevia.com.br";
const group = 1;
const path = window.location.pathname;
let adre = `http://localhost:8085/api/v1/sip${path}`
const mainSection = document.querySelector("#main-section");
const loadingSection = document.querySelector("#loading-section")
const loginName = document.querySelector("#login-name")
const deviceId = getDeviceId()
console.log("o adre ficou: " + adre)
async function initializeSipNumber() {
    const sipNumbere = await getFreeSip()

    sipNumber = Object.keys(sipNumbere)[0];
    pass = Object.values(sipNumbere)[0];
    console.log(sipNumber + " " + " " + pass)
}

initializeSipNumber().then(() => {
    configuration = initialWebSocketConfiguration();
    console.log("minha configuration " + configuration)
    ua = new JsSIP.UA(configuration);
    ua.on('registered', () => {
        updateSectionDisplay(true, false)
        //Colocar post
        //await callRecords();
        console.log(`Registro bem sucedido como ${configuration.uri}`)
        updateMainSection("Logado como sip: " + sipNumber + " usando o roteador " + window.location.pathname)
    })
    ua.start();
});
function updateSectionDisplay(mainSectionDisplay, loadingSectionDisplay){
   mainSectionDisplay? mainSection.style.display = "flex" : mainSection.style.display = "none" ;
    loadingSectionDisplay ? loadingSection.style.display = "flex": loadingSection.style.display = "none";
}

function getDeviceId() {
        
// Gera um ID que persiste apenas durante a sessão
let deviceId = sessionStorage.getItem('deviceId');

if (!deviceId) {
  deviceId = window.crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
  sessionStorage.setItem('deviceId', deviceId);
}
return deviceId;
      }

function updateMainSection(content){
    loginName.innerHTML = content
}

async function callRecords(){
    // try{
    //    const response = await fetch(adre,{
    //     method: 'POST'

    //     })
    // }
}

function initialWebSocketConfiguration() {
    
    const socket = new JsSIP.WebSocketInterface('wss://www.homologacaotracevia.com.br/ws');

  //  const socket = new JsSIP.WebSocketInterface('wss://192.168.1.92:8089/ws');
    return {
        uri: `sip:${sipNumber}@${ipNumber}`,
        password: pass,
        sockets: [socket],
        register: true,
        session_timers: false,
         register_expires: 600
    };


}

// Criação do User Agent




// Variável para armazenar a sessão atual
let currentSession = null;

// Função para iniciar uma chamada
async function startCall() {
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

            updateCallButton();
        }
    };
    const data = new Date("2025-");
    const options = {
        eventHandlers: eventHandlers,
        mediaConstraints: { audio: true, video: false },
        rtcOfferConstraints: {
            offerToReceiveAudio: true,
            offerToReceiveVideo: false
        },
    };
    try{
    // Solicita permissão para acessar o microfone
   const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            // Inicia a chamada para o atendente
            if(stream){

            await sendCallInfos()
            currentSession = ua.call(`sip:${dialpanacount}@${ipNumber}`, options)

            // Adiciona o stream local à chamada
            currentSession.connection.addEventListener('track', (event) => {
                const remoteStream = new MediaStream();
                remoteStream.addTrack(event.track);

                const remoteAudio = document.createElement('audio');
                remoteAudio.srcObject = remoteStream;
                remoteAudio.play();
            });
        }else{
            throw new Error("Erro ao capturar stream de áudio.");

        }
         }catch(error) {
            alert('Erro ao acessar o microfone. Por favor, atualize a página e de as permissões necessárias');
            console.log(error)
}
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
document.querySelector("#sos-button").addEventListener('click',async () => {
    if (currentSession) {
        endCall();
    } else {
        await startCall();
    }
});

// Inicia o User Agent
window.addEventListener("beforeunload", () => {
    if (ua) {
        ua.unregister();
        ua.transport.disconnect();
    }
});

async function sendCallInfos(){
    const response = await fetch(`http://localhost:8085/api/v1/register-call`,{
        method: 'POST',
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            sip: sipNumber,
            router: path[1]
        })
    });
    if(!response.ok){
        alert("Favor, atualize a página e tente realizar a ligação novamente")
        throw new Error("Erro na requisição de chamada")
    }
    const data = await response.json();


}
async function getFreeSip(){
    //const response = await fetch("http://192.168.1.45:8085/api/v1/sip");
  
    try{
        const response = await fetch(adre,{
            method: 'GET',
        });
        if(!response){
            throw new Error("Erro ao obter sip");
        }
        const sipData = await response.json();
        console.log(sipData)
        return sipData
    }catch(e){
        console.log("Erro ao obter sip")
        alert("Trocar de roteador")
    }

    
}

