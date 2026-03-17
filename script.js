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
        const res = await fetch('https://api.ryzeautojoiner.vercel.app'); // SEM /latest
        if (!res.ok) throw new Error('Erro ao buscar frame');

        const data = await res.json(); // espera { "img_base_64": "..." }
        if (!data.img_base_64) return;

        const img = new Image();
        img.src = `data:image/jpeg;base64,${data.img_base_64}`;
        img.onload = () => {
            placeholder.style.display = 'none';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.onerror = () => {
            console.error('Erro ao carregar a imagem do servidor');
            placeholder.style.display = 'block';
            placeholder.textContent = 'Erro ao carregar imagem';
        };
    } catch (e) {
        console.error(e);
        setStatus('Erro ao buscar frame', 'status-error');
    }
}

// Ajusta canvas para o tamanho da div
function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

// Start polling a 5 FPS
function startPolling() {
    setStatus('Conectado', 'status-ok');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    polling = setInterval(fetchFrame, 200); // 5 FPS = 200ms
}

// Inicia polling automaticamente
startPolling();
