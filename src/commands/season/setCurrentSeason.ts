import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
} from "discord.js";
import { Command } from "../commands";
import { RateLimiter } from "discord.js-rate-limiter";
import Seasons from "../../models/season.model";

export default class SetCurrentSeasonCommand implements Command {
  public data = new SlashCommandBuilder()
    .setName("definir-temporada-atual")
    .setDescription("Define a temporada atual na tabela seasons.")
    .addStringOption((option) =>
      option
        .setName("temporada")
        .setDescription("Versão da temporada para ser definida como atual.")
        .setRequired(true)
        .setAutocomplete(true),
    );

  public cooldown = new RateLimiter(1, 5000);

  public async execute(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const seasonName = interaction.options.getString("temporada", true);

    const currentSeason = await Seasons.findOne({
      where: { is_current: true },
    });

    if (currentSeason) {
      await currentSeason.update({ is_current: false });
    }

    const seasonEntry = await Seasons.findOne({
      where: { season: seasonName, is_deleted: false },
    });
    if (seasonEntry) {
      await seasonEntry.update({ is_current: true });
      await interaction.reply({
        content: `Temporada ${seasonName} definida como a temporada atual.`,
        flags: ["Ephemeral"],
      });
    } else {
      await interaction.reply({
        content: "Temporada não encontrada.",
        flags: ["Ephemeral"],
      });
    }
  }

  public async autocomplete(
    interaction: AutocompleteInteraction,
  ): Promise<void> {
    const focused = interaction.options.getFocused().toLowerCase();

    const seasons = await Seasons.findAll({
      where: { is_deleted: false },
      order: [["season", "ASC"]],
      limit: 25,
    });

    const filtered = seasons
      .map((s) => s.season)
      .filter((v) => v.toLowerCase().includes(focused))
      .slice(0, 25)
      .map((v) => ({ name: v, value: v }));

    await interaction.respond(filtered);
  }
}
