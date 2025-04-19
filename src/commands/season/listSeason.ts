import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../commands";
import { RateLimiter } from "discord.js-rate-limiter";
import Seasons from "../../models/season.model";
import { STRING_COMMANDS } from "..";

export default class ListSeasonsCommand implements Command {
  public data = new SlashCommandBuilder()
    .setName(STRING_COMMANDS.LIST_SEASON)
    .setDescription("Lista todas as temporadas ativas (não deletadas).");

  public cooldown = new RateLimiter(1, 5000);

  public async execute(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const seasons = await Seasons.findAll({
      where: { isDeleted: false },
      order: [
        ["is_current", "DESC"],
        ["season", "ASC"],
      ],
    });

    if (!seasons.length) {
      await interaction.reply({
        content: "Nenhuma temporada ativa foi encontrada.",
        flags: ["Ephemeral"],
      });
      return;
    }

    const seasonsList = seasons
      .map((t) => {
        const sufix = t.isCurrent ? " - (**Temporada Atual**)" : "";
        return `${t.season}${sufix}`;
      })
      .join("\n");

    await interaction.reply({
      content: `**Temporadas Ativas:**\n${seasonsList}`,
      flags: ["Ephemeral"],
    });
  }
}
