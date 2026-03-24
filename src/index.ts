import { config } from "./config/config";
import { start, stop } from "./scripts/database";
import { client } from "./config/client";

import "./events/ready";
import "./events/guildCreate";
import "./events/interactionCreate";
import "./scripts/healthCheck";
import { setShuttingDown } from "./state/shutdown";

let isShuttingDown = false;

async function init() {
  await client.login(config.discord.token);
  await start();

  console.log("✅ App iniciado");
}

async function shutdown(signal: string) {
  if (isShuttingDown) return;
  setShuttingDown(true);

  console.log(`🛑 Recebido ${signal}. Encerrando com segurança...`);

  try {
    client.destroy();
    await stop();

    console.log("✅ Shutdown concluído");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erro no shutdown:", err);
    process.exit(1);
  }
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

init();
