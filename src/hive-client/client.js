import { Client } from "@hiveio/dhive";
import { SERVERS } from "./server";

export const client = new Client(SERVERS, {
  timeout: 3000,
  failoverThreshold: 3,
  consoleOnFailover: true,
})