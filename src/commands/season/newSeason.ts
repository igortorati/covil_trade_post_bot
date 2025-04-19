import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../commands";
import { RateLimiter } from "discord.js-rate-limiter";
import Seasons from "../../models/season.model";
import { STRING_COMMANDS } from "..";

export default class NewSeasonCommand implements Command {
  public data = new SlashCommandBuilder()
    .setName(STRING_COMMANDS.CREATE_SEASON)
    .setDescription("Cria uma nova temporada na tabela seasons.")
    .addStringOption((option) =>
      option
        .setName("temporada")
        .setDescription("Versão da nova temporada.")
        .setRequired(true)
        .setMinLength(1),
    );

  public cooldown = new RateLimiter(1, 5000);

  public async execute(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const season = interaction.options.getString("temporada", true);

    const existing = await Seasons.findOne({
      where: { season },
    });

    if (existing) {
      await interaction.reply({
        content: `🚫 Já existe uma temporada com o nome **${season}**.`,
        flags: ["Ephemeral"],
      });
      return;
    }

    await Seasons.create({
      season,
      isCurrent: false,
      isDeleted: false,
    } as Seasons);

    await interaction.reply({
      content: `Temporada ${season} criada com sucesso!`,
      flags: ["Ephemeral"],
    });
  }
}
