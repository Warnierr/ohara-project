import io from 'socket.io-client';

export class Network {
    constructor(pseudo) {
        this.pseudo = pseudo;
        this.socket = null;
        this.id = null;
        this.lastPositionSent = { x: 0, y: 0, z: 0 };
        this.positionThrottle = 50; // ms between position updates
        this.lastPositionTime = 0;
        this.eventHandlers = new Map();
    }

    connect() {
        // Connect to local server (change for production)
        const serverUrl = 'http://localhost:3000';

        this.socket = io(serverUrl, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });

        // Connection events
        this.socket.on('connect', () => {
            console.log('🔌 Connected to server:', this.socket.id);
            this.id = this.socket.id;

            // Join with pseudo
            this.socket.emit('join', { pseudo: this.pseudo });
        });

        this.socket.on('disconnect', () => {
            console.log('⚠️ Disconnected from server');
        });

        this.socket.on('connect_error', (error) => {
            console.error('❌ Connection error:', error);
            this.trigger('error', error);
        });

        // Game events
        this.socket.on('player-joined', (data) => {
            this.trigger('player-joined', data);
        });

        this.socket.on('players-list', (data) => {
            this.trigger('players-list', data);
        });

        this.socket.on('player-moved', (data) => {
            this.trigger('player-moved', data);
        });

        this.socket.on('player-left', (data) => {
            this.trigger('player-left', data);
        });

        this.socket.on('joined', (data) => {
            console.log('✅ Joined as:', data);
            this.id = data.id;
            this.trigger('connected', data);
        });
    }

    sendPosition(position) {
        if (!this.socket || !this.socket.connected) return;

        const now = Date.now();

        // Throttle position updates
        if (now - this.lastPositionTime < this.positionThrottle) {
            return;
        }

        // Only send if position changed significantly
        const threshold = 0.1;
        const dx = Math.abs(position.x - this.lastPositionSent.x);
        const dy = Math.abs(position.y - this.lastPositionSent.y);
        const dz = Math.abs(position.z - this.lastPositionSent.z);

        if (dx < threshold && dy < threshold && dz < threshold) {
            return;
        }

        this.socket.emit('move', {
            position: {
                x: position.x,
                y: position.y,
                z: position.z
            }
        });

        this.lastPositionSent = { x: position.x, y: position.y, z: position.z };
        this.lastPositionTime = now;
    }

    sendMessage(message) {
        if (!this.socket) return;
        this.socket.emit('chat', { message });
    }

    // Event system
    on(event, handler) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event).push(handler);
    }

    trigger(event, data) {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            handlers.forEach(handler => handler(data));
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}
