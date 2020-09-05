import { port } from './config';

new WebSocket(`ws://localhost:${port}`).addEventListener('message', () => window.location.reload());
