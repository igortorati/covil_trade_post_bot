import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
} from "discord.js";
import { Command } from "../commands";
import { RateLimiter } from "discord.js-rate-limiter";
import Seasons from "../../models/season.model";

export default class UndeleteSeasonCommand implements Command {
  public data = new SlashCommandBuilder()
    .setName("reativar-temporada")
    .setDescription("Reativa uma temporada que foi desativada.")
    .addStringOption(option =>
      option
        .setName("temporada")
        .setDescription("Versão da temporada a ser reativada.")
        .setRequired(true)
        .setAutocomplete(true)
    );

  public cooldown = new RateLimiter(1, 5000);

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const season = interaction.options.getString("temporada", true);

    const temporada = await Seasons.findOne({ where: { season, is_deleted: true } });

    if (temporada) {
      await temporada.update({ is_deleted: false });
      await interaction.reply({ content: `Temporada ${season} reativada com sucesso.`, flags: ["Ephemeral"] });
    } else {
      await interaction.reply({ content: "Temporada não encontrada ou já está ativa.", flags: ["Ephemeral"] });
    }
  }

  public async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
    const focused = interaction.options.getFocused().toLowerCase();

    const temporadas = await Seasons.findAll({
      where: { is_deleted: true },
      order: [["season", "ASC"]],
      limit: 25,
    });

    const suggestions = temporadas
      .map(t => t.season)
      .filter(v => v.toLowerCase().includes(focused))
      .slice(0, 25)
      .map(v => ({ name: v, value: v }));

    await interaction.respond(suggestions);
  }
}
  