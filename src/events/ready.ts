import { Events } from "discord.js";
import { client } from "../config/client";

client.once(Events.ClientReady, () => {
  console.log("Discord bot is ready! 🤖");
});
