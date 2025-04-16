import { Client, Events } from "discord.js";
import { deployCommands } from "./deployCommands";
import { commands } from "./commands";

export const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
});

client.once(Events.ClientReady, () => {
  console.log("Discord bot is ready! 🤖");
});

client.on(Events.GuildCreate, async (guild) => {
  await deployCommands();
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = commands[interaction.commandName];
    if (command) {
      await command.execute(interaction);
    }
  }

  if (interaction.isAutocomplete()) {
    const command = commands[interaction.commandName];
    if (command?.autocomplete) {
      const focused = interaction.options.getFocused(true);
      await command.autocomplete(interaction);
    }
  }

  if (interaction.isModalSubmit()) {
    const [commandName] = interaction.customId.split(":");
    const command = commands[commandName];
    if (command?.modalSubmit) {
      await command.modalSubmit(interaction);
    }
  }
});