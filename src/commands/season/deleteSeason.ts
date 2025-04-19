import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
} from "discord.js";
import { Command } from "../commands";
import { RateLimiter } from "discord.js-rate-limiter";
import Seasons from "../../models/season.model";
import { STRING_COMMANDS } from "..";

export default class DeleteSeasonCommand implements Command {
  public data = new SlashCommandBuilder()
    .setName(STRING_COMMANDS.DEACTIVATE_SEASON)
    .setDescription("Desativa uma temporada e a define como não ativa.")
    .addStringOption((option) =>
      option
        .setName("temporada")
        .setDescription("Versão da temporada a ser desativada.")
        .setRequired(true)
        .setAutocomplete(true),
    );

  public cooldown = new RateLimiter(1, 5000);

  public async execute(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const season = interaction.options.getString("temporada", true);

    const temporada = await Seasons.findOne({
      where: { season, isDeleted: false },
    });

    if (temporada) {
      await temporada.update({ isDeleted: true, isCurrent: false });
      await interaction.reply({
        content: `Temporada ${season} desativada com sucesso.`,
        flags: ["Ephemeral"],
      });
    } else {
      await interaction.reply({
        content: "Temporada não encontrada ou já está desativada.",
        flags: ["Ephemeral"],
      });
    }
  }

  public async autocomplete(
    interaction: AutocompleteInteraction,
  ): Promise<void> {
    const focused = interaction.options.getFocused().toLowerCase();

    const temporadas = await Seasons.findAll({
      where: { isDeleted: false },
      order: [["season", "ASC"]],
      limit: 25,
    });

    const suggestions = temporadas
      .map((t) => t.season)
      .filter((v) => v.toLowerCase().includes(focused))
      .slice(0, 25)
      .map((v) => ({ name: v, value: v }));

    await interaction.respond(suggestions);
  }
}
