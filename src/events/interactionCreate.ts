import { Events } from "discord.js";
import { client } from "../config/client";
import { commands } from "../commands";
import { isShuttingDown } from "../state/shutdown";
import { handleButton } from "../handler/buttonHandler";

client.on(Events.InteractionCreate, async (interaction) => {
  if (isShuttingDown) return;

  try {
    if (interaction.isAutocomplete()) {
      const command = commands[interaction.commandName];
      if (command?.autocomplete) {
        return await command.autocomplete(interaction);
      }
    }

    if (interaction.isChatInputCommand()) {
      const command = commands[interaction.commandName];
      if (command) {
        return await command.execute(interaction);
      }
    }

    if (interaction.isModalSubmit()) {
      const [commandName] = interaction.customId.split(":");
      const command = commands[commandName];
      if (command?.modalSubmit) {
        return await command.modalSubmit(interaction);
      }
    }

    if (interaction.isButton()) {
      return await handleButton(interaction);
    }
  } catch (err) {
    console.error("Erro em interactionCreate:", err);
  }
});