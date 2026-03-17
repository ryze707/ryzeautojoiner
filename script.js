const statusEl = document.getElementById('status');
const canvas = document.getElementById('canvas');
const placeholder = document.getElementById('placeholder');
const ctx = canvas.getContext('2d');

let polling = null;

// Atualiza status
function setStatus(text, className='status-off') {
    statusEl.textContent = text;
    statusEl.className = className;
}

// Função que busca a última imagem do servidor
async function fetchFrame() {
    try {
        const res = await fetch('https://ryzeautojoiner.vercel.app/latest'); // endpoint que recebe o frame
        if(!res.ok) throw new Error('Erro ao buscar frame');
        const data = await res.json(); // espera { "img_base_64": "..." }
        if(!data.img_base_64) return;

        const img = new Image();
        img.src = `data:image/jpeg;base64,${data.img_base_64}`;
        img.onload = () => {
            placeholder.style.display = 'none';
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
    } catch(e) {
        console.error(e);
        setStatus('Erro ao buscar frame', 'status-error');
    }
}

// Start polling a 5 FPS
function startPolling() {
    setStatus('Conectado', 'status-ok');
    polling = setInterval(fetchFrame, 200); // 5 FPS = 200ms
}

startPolling();
