import { Events } from "discord.js";
import { client } from "../config/client";
import { deployCommands } from "../scripts/deployCommands";

client.on(Events.GuildCreate, async () => {
  await deployCommands();
});
