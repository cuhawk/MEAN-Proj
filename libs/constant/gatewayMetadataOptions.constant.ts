import { GatewayMetadata } from "@nestjs/websockets";

const GATEWAY_META_OPTIONS: GatewayMetadata = {
  namespace: '/',
  serveClient: true,
  cors: {
    origin: "*",
    methods: "OPTIONS,GET,POST",
  }
};

export default GATEWAY_META_OPTIONS;
