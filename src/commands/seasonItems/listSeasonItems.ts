import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../commands";
import { RateLimiter } from "discord.js-rate-limiter";
import AvailableItems from "../../models/availableItem.model";
import Items from "../../models/item.model";
import Rarities from "../../models/rarity.model";
import Seasons from "../../models/season.model";
import { Op } from "sequelize";
import { STRING_COMMANDS } from "..";

export default class ListSeasonItemsCommand implements Command {
  public data = new SlashCommandBuilder()
    .setName(STRING_COMMANDS.LIST_SEASON_ITEMS)
    .setDescription("Lista os itens disponíveis para uma temporada.")
    .addStringOption((option) =>
      option
        .setName("temporada")
        .setDescription("Temporada para listar os itens.")
        .setRequired(true)
        .setAutocomplete(true),
    );

  public cooldown = new RateLimiter(1, 5000);

  public async execute(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const seasonId = interaction.options.getString("temporada", true);

    const season = await Seasons.findOne({
      where: { id: seasonId, isDeleted: false },
    });
    if (!season) {
      await interaction.reply({
        content: "Temporada não encontrada.",
        flags: ["Ephemeral"],
      });
      return;
    }

    const availableItems = await AvailableItems.findAll({
      where: { seasonId: seasonId },
      include: [{ model: Items, include: [Rarities] }],
      order: [[{ model: Items, as: "item" }, "name", "ASC"]],
    });

    if (availableItems.length === 0) {
      await interaction.reply({
        content: "Nenhum item disponível para esta temporada.",
        flags: ["Ephemeral"],
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`📦 Itens disponíveis – Temporada: ${season.season}`)
      .setColor("Blurple");

    for (const ai of availableItems) {
      const item = ai.item!;
      const rarity = item.rarity!;

      embed.addFields({
        name: `🆔 ID: ${ai.id}`,
        value: [
          `**🧪 ${item.name}** — *${rarity.namePt}*`,
          `**💰 Preço:** ${ai.price} PO`,
          `**📦 Quantidade disponível:** ${ai.quantity}`,
          `**🔁 Permite troca:** ${ai.canTrade ? "Sim" : "Não"}`,
          `\u200B`, // espaço visual entre blocos
        ].join("\n"),
        inline: false,
      });
    }

    await interaction.reply({ embeds: [embed], flags: ["Ephemeral"] });
  }

  public async autocomplete(
    interaction: AutocompleteInteraction,
  ): Promise<void> {
    const focusedOption = interaction.options.getFocused(true);
    const value = focusedOption.value?.toString().trim();

    const seasons = await Seasons.findAll({
      where: {
        isDeleted: false,
        season: { [Op.like]: `%${value}%` },
      },
      limit: 25,
    });

    const choices = seasons.map((season) => ({
      name: season.season,
      value: season.id.toString(),
    }));

    await interaction.respond(choices);
  }
}
