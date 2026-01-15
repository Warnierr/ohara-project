import { Scene } from './src/Scene.js';
import { Network } from './src/Network.js';

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const pseudoInput = document.getElementById('pseudo-input');
const joinBtn = document.getElementById('join-btn');
const hud = document.getElementById('hud');
const instructions = document.getElementById('instructions');
const loading = document.getElementById('loading');
const playersList = document.getElementById('players-list');

// Game State
let scene = null;
let network = null;
let isConnected = false;

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  // Hide loading
  loading.classList.add('hidden');

  // Focus input
  pseudoInput.focus();

  // Enter key to join
  pseudoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      joinGame();
    }
  });

  // Button click
  joinBtn.addEventListener('click', joinGame);
});

function joinGame() {
  const pseudo = pseudoInput.value.trim();

  if (!pseudo) {
    pseudoInput.style.borderColor = 'red';
    pseudoInput.focus();
    return;
  }

  if (pseudo.length < 2) {
    alert('Le pseudo doit faire au moins 2 caractères');
    return;
  }

  // Hide login screen
  loginScreen.classList.add('hidden');
  loading.classList.remove('hidden');

  // Initialize scene
  scene = new Scene();
  scene.init();

  // Initialize network
  network = new Network(pseudo);
  network.connect();

  // Network event handlers
  network.on('connected', () => {
    console.log('✅ Connecté au serveur');
    loading.classList.add('hidden');
    hud.classList.remove('hidden');
    instructions.classList.remove('hidden');
    isConnected = true;

    // Start animation loop
    animate();
  });

  network.on('player-joined', (player) => {
    console.log('👤 Nouveau joueur:', player.pseudo);
    scene.addPlayer(player);
    updatePlayersList();
  });

  network.on('players-list', (players) => {
    console.log('📋 Liste des joueurs:', players.length);
    players.forEach(player => {
      if (player.id !== network.id) {
        scene.addPlayer(player);
      }
    });
    updatePlayersList();
  });

  network.on('player-moved', (data) => {
    scene.updatePlayerPosition(data.id, data.position);
  });

  network.on('player-left', (data) => {
    console.log('👋 Joueur parti:', data.id);
    scene.removePlayer(data.id);
    updatePlayersList();
  });

  network.on('error', (error) => {
    console.error('❌ Erreur réseau:', error);
    alert('Erreur de connexion au serveur. Raffraîchis la page.');
  });
}

function updatePlayersList() {
  if (!scene) return;
  
  const players = scene.getPlayers();
  playersList.innerHTML = '';

  players.forEach(player => {
    const li = document.createElement('li');
    const isMe = network && player.id === network.id;
    li.textContent = `${isMe ? '👤 (Moi)' : '👥'} ${player.pseudo}`;
    li.style.color = player.color;
    playersList.appendChild(li);
  });
}

function animate() {
  if (!isConnected || !scene || !network) return;

  requestAnimationFrame(animate);

  // Update scene
  scene.update();

  // Send position to server (throttled in Network)
  const localPlayer = scene.getLocalPlayer();
  if (localPlayer) {
    network.sendPosition(localPlayer.position);
  }

  // Render
  scene.render();
}

// Handle window resize
window.addEventListener('resize', () => {
  if (scene) {
    scene.onWindowResize();
  }
});

// Debug
window.scene = scene;
window.network = network;
