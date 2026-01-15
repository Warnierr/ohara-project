import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Game } from './Game.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        players: game.getPlayerCount(),
        uptime: process.uptime()
    });
});

// Game instance
const game = new Game();

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join game
    socket.on('join', (data) => {
        const player = game.addPlayer(socket.id, data.pseudo);

        // Send confirmation to player
        socket.emit('joined', {
            id: socket.id,
            pseudo: player.pseudo,
            position: player.position,
            color: player.color
        });

        // Send existing players to new player
        const existingPlayers = game.getPlayers()
            .filter(p => p.id !== socket.id)
            .map(p => ({
                id: p.id,
                pseudo: p.pseudo,
                position: p.position,
                color: p.color
            }));

        socket.emit('players-list', existingPlayers);

        // Broadcast new player to others
        socket.broadcast.emit('player-joined', {
            id: socket.id,
            pseudo: player.pseudo,
            position: player.position,
            color: player.color
        });

        console.log(`✅ Player joined: ${player.pseudo} (${socket.id})`);
    });

    // Movement
    socket.on('move', (data) => {
        const player = game.getPlayer(socket.id);
        if (!player) return;

        // Validate position (basic anti-cheat)
        const MAX_SPEED = 10; // units per update
        const dx = data.position.x - player.position.x;
        const dy = data.position.y - player.position.y;
        const dz = data.position.z - player.position.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance > MAX_SPEED) {
            console.warn(`⚠️ Suspicious movement from ${socket.id}: ${distance}`);
            return; // Reject
        }

        // Update position
        game.updatePlayerPosition(socket.id, data.position);

        // Broadcast to others
        socket.broadcast.emit('player-moved', {
            id: socket.id,
            position: data.position
        });
    });

    // Chat (for future)
    socket.on('chat', (data) => {
        const player = game.getPlayer(socket.id);
        if (!player) return;

        io.emit('chat-message', {
            id: socket.id,
            pseudo: player.pseudo,
            message: data.message,
            timestamp: Date.now()
        });

        console.log(`💬 ${player.pseudo}: ${data.message}`);
    });

    // Disconnect
    socket.on('disconnect', () => {
        const player = game.getPlayer(socket.id);
        if (player) {
            console.log(`👋 Player left: ${player.pseudo} (${socket.id})`);
            game.removePlayer(socket.id);

            // Notify others
            io.emit('player-left', { id: socket.id });
        }
    });
});

// Game loop (for future AI NPCs, game logic)
setInterval(() => {
    game.update();
}, 1000 / 20); // 20 ticks per second

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`🌳 OHARA server running on http://localhost:${PORT}`);
    console.log(`📡 Socket.io ready for connections`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('⚠️ SIGTERM received, shutting down gracefully...');
    httpServer.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});
