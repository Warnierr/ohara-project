export class Game {
    constructor() {
        this.players = new Map(); // socketId -> Player
        this.npcs = []; // For future AI NPCs
        this.startTime = Date.now();
    }

    addPlayer(id, pseudo) {
        // Generate random color for player
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
            '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
            '#F8B739', '#52B788', '#E07A5F', '#3D5A80'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Random spawn position around campfire
        const angle = Math.random() * Math.PI * 2;
        const radius = 8 + Math.random() * 3;
        const position = {
            x: Math.cos(angle) * radius,
            y: 0,
            z: Math.sin(angle) * radius
        };

        const player = {
            id,
            pseudo: pseudo || `Player${Math.floor(Math.random() * 1000)}`,
            position,
            color,
            joinedAt: Date.now()
        };

        this.players.set(id, player);
        return player;
    }

    getPlayer(id) {
        return this.players.get(id);
    }

    getPlayers() {
        return Array.from(this.players.values());
    }

    getPlayerCount() {
        return this.players.size;
    }

    updatePlayerPosition(id, position) {
        const player = this.players.get(id);
        if (player) {
            player.position = position;
        }
    }

    removePlayer(id) {
        this.players.delete(id);
    }

    update() {
        // Game loop tick
        // Future: Update NPCs, check quests, trigger events
    }

    getState() {
        return {
            players: this.getPlayers(),
            npcs: this.npcs,
            uptime: Date.now() - this.startTime
        };
    }
}
