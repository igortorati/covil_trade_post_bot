import { Events } from "discord.js";
import { client } from "../config/client";
import { commands } from "../commands";

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isModalSubmit()) {
    const [commandName] = interaction.customId.split(":");
    const command = commands[commandName];
    if (command?.modalSubmit) {
      await command.modalSubmit(interaction);
    }
  }
});
