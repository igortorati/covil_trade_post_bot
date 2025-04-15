
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { Command } from "../commands";
import { RateLimiter } from "discord.js-rate-limiter";

export default class PingCommand implements Command {
  public data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!");

  public cooldown = new RateLimiter(1, 5000); // opcional, exemplo: 1 uso a cada 5s

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply("Pong!!!");
  }
}
