import { REST, Routes } from "discord.js";
import { config } from "../config/config";
import { commands } from "../commands";

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(config.discord.token);

export async function deployCommands() {
  try {
    console.info("Started refreshing application (/) commands.");

    console.info("Commands loaded:", Object.values(commands).length);
    await rest.put(
      Routes.applicationGuildCommands(
        config.discord.clientId,
        config.discord.guildId,
      ),
      {
        body: commandsData,
      },
    );

    console.info("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.info("Something went wrong while updating commands.");
    console.error(error);
  }
}

deployCommands();
