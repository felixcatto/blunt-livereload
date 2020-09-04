import { port } from './config.js';

new WebSocket(`ws://localhost:${port}`).addEventListener('message', () => window.location.reload());
