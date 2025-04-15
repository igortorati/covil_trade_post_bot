import { Client, Events } from "discord.js";
import { deployCommands } from "./deployCommands";
import { commands } from "./commands";
import { config } from "./config/config";

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
  console.log("Nova interação recebida: ", interaction.type);
  if (interaction.isChatInputCommand()) {
    console.log("Comando recebido:", interaction.commandName);
    const command = commands[interaction.commandName];
    console.log("Comando recebido:", command);
    if (command) {
      await command.execute(interaction);
    }
  }

  if (interaction.isAutocomplete()) {
    const command = commands[interaction.commandName];
    console.log("command", command)
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