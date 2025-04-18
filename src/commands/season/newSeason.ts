import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
  } from "discord.js";
  import { Command } from "../commands";
  import { RateLimiter } from "discord.js-rate-limiter";
  import Seasons from "../../models/season.model";
  
  export default class NewSeasonCommand implements Command {
    public data = new SlashCommandBuilder()
      .setName("nova-temporada")
      .setDescription("Cria uma nova temporada na tabela seasons.")
      .addStringOption(option =>
        option.setName("temporada")
          .setDescription("Versão da nova temporada.")
          .setRequired(true).setMinLength(1));
  
    public cooldown = new RateLimiter(1, 5000);
  
    public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
      const season = interaction.options.getString("temporada", true);
  
      await Seasons.create({
        season,
        is_current: false,
        is_deleted: false
      } as Seasons);
  
      await interaction.reply({ content: `Temporada ${season} criada com sucesso!`, flags: ["Ephemeral"] });
    }
  }
  