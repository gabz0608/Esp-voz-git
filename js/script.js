import { database, ref, set, onValue } from "./conexao.js";

const micBtn = document.getElementById("mic-btn");
const transcriptText = document.getElementById("transcript");
const statusLed = document.getElementById("status-led");
const statusText = document.getElementById("status-text");

// Referência do nó do LED no Firebase Realtime Database
const ledRef = ref(database, "led/status");

// 1. Escuta alterações em tempo real do Firebase para atualizar a tela
onValue(ledRef, (snapshot) => {
  const estado = snapshot.val();
  
  if (estado === 1) {
    statusLed.className = "led-indicator on";
    statusText.innerText = "LED Ligado";
  } else {
    statusLed.className = "led-indicator off";
    statusText.innerText = "LED Desligado";
  }
});

// 2. Configuração do Reconhecimento de Voz (Web Speech API)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert("Seu navegador não suporta a Web Speech API. Use o Google Chrome.");
} else {
  const recognition = new SpeechRecognition();
  recognition.lang = "pt-BR";
  recognition.continuous = false;

  micBtn.addEventListener("click", () => {
    recognition.start();
  });

  recognition.onstart = () => {
    micBtn.classList.add("listening");
    transcriptText.innerText = "Ouvindo...";
  };

  recognition.onresult = (event) => {
    const comando = event.results[0][0].transcript.toLowerCase();
    transcriptText.innerText = `Você disse: "${comando}"`;

    if (comando.includes("ligar")) {
      atualizarFirebase(1);
    } else if (comando.includes("desligar")) {
      atualizarFirebase(0);
    } else {
      transcriptText.innerText = `Comando "${comando}" não reconhecido. Diga "ligar" ou "desligar".`;
    }
  };

  recognition.onerror = (event) => {
    transcriptText.innerText = `Erro no reconhecimento: ${event.error}`;
  };

  recognition.onend = () => {
    micBtn.classList.remove("listening");
  };
}

// 3. Atualiza o valor de status no Firebase
function atualizarFirebase(valor) {
  set(ledRef, valor)
    .then(() => {
      console.log(`Firebase atualizado: ${valor}`);
    })
    .catch((error) => {
      console.error("Erro ao atualizar Firebase:", error);
      transcriptText.innerText = "Erro ao enviar dados para o Firebase.";
    });
}