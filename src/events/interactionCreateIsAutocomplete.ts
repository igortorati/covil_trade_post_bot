import { Events } from "discord.js";
import { client } from "../config/client";
import { commands } from "../commands";

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isAutocomplete()) {
    const command = commands[interaction.commandName];
    if (command?.autocomplete) {
      await command.autocomplete(interaction);
    }
  }
});
