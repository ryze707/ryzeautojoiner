const statusEl = document.getElementById('status');
const videoEl = document.getElementById('video');
const placeholder = document.getElementById('placeholder');
const btnStart = document.getElementById('btn-start');
const btnStop = document.getElementById('btn-stop');

let pc;        // PeerConnection
let localStream;

// Atualiza status
function setStatus(text, className='status-off') {
  statusEl.textContent = text;
  statusEl.className = className;
}

// Inicia transmissão usando WebRTC
async function startTransmission() {
  try {
    // Pede permissão para capturar a tela
    localStream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: 20 },
      audio: false
    });

    videoEl.srcObject = localStream;
    videoEl.style.display = 'block';
    placeholder.style.display = 'none';

    // Cria conexão WebRTC
    pc = new RTCPeerConnection();

    // Adiciona stream local
    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

    // Simula envio: no seu caso você precisaria de um servidor que recebe o offer e envia back a resposta
    pc.onicecandidate = e => {
      if (e.candidate) {
        // aqui normalmente enviaria para o servidor de sinalização
      }
    };

    // Criar offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Aqui você enviaria `offer` para o servidor de sinalização e receberia `answer`
    // Para teste local, o próprio navegador pode criar loopback (não recomendado para produção)
    
    setStatus('Transmitindo', 'status-ok');
    btnStart.disabled = true;
    btnStop.disabled = false;
  } catch (err) {
    console.error(err);
    setStatus('Erro na transmissão', 'status-error');
  }
}

// Para transmissão
function stopTransmission() {
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }
  if (pc) {
    pc.close();
    pc = null;
  }
  videoEl.style.display = 'none';
  placeholder.style.display = 'block';
  setStatus('Desconectado', 'status-off');
  btnStart.disabled = false;
  btnStop.disabled = true;
}

btnStart.onclick = startTransmission;
btnStop.onclick = stopTransmission;
