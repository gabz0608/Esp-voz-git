// Importa os módulos necessários do SDK v9 do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Configuração do Firebase com as suas credenciais
const firebaseConfig = {
  apiKey: "AIzaSyB_wO3lbHGpptKXXVclnALe5qnfx5M8o5E",
  authDomain: "esp32-e736f.firebaseapp.com",
  databaseURL: "https://esp32-e736f-default-rtdb.firebaseio.com",
  projectId: "esp32-e736f",
  storageBucket: "esp32-e736f.firebasestorage.app",
  messagingSenderId: "432211354706",
  appId: "1:432211354706:web:38d17ae3bb99c96b43eb8b",
  measurementId: "G-HCP2J5X2QT"
};

// Inicializa o aplicativo Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o banco de dados de tempo real (Realtime Database)
const database = getDatabase(app);

// Exporta o banco de dados e as funções de leitura/escrita para usar no script principal
export { database, ref, set, onValue };