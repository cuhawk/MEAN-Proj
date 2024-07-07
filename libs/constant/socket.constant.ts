import { SocketIoConfig } from "ngx-socket-io";

const socketIOConfig: SocketIoConfig = {
  url: 'ws://localhost:8080',
  options: {}
};

const websocketConfig: { maxParticipant: number } = {
  maxParticipant: 10
}

export {socketIOConfig, websocketConfig} ;
