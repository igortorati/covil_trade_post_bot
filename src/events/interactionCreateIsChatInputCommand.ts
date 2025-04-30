import { Events } from "discord.js";
import { client } from "../config/client";
import { commands } from "../commands";

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = commands[interaction.commandName];
    if (command) {
      await command.execute(interaction);
    }
  }
});
