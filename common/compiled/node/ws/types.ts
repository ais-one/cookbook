import type WebSocket from 'ws';

export interface AliveWebSocket extends WebSocket {
  isAlive: boolean;
}
