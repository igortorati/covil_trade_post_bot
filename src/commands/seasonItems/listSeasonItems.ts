import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  AutocompleteInteraction,
} from "discord.js";
import { Command } from "../commands";
import { RateLimiter } from "discord.js-rate-limiter";
import AvailableItems from "../../models/availableItem.model";
import Items from "../../models/item.model";
import Rarities from "../../models/rarity.model";
import Seasons from "../../models/season.model";
import { STRING_COMMANDS } from "..";
import { Op } from "sequelize";
import { createPaginatedEmbeds } from "../../utils/paginatedListItemsEmbed";
import { handleEmbedPagination } from "../../utils/handleEmbedListItemsPagination";

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

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const seasonId = interaction.options.getString("temporada", true);

    const season = await Seasons.findOne({
      where: { id: seasonId, isDeleted: false },
    });

    if (!season) {
      await interaction.reply({
        content: "❌ Temporada não encontrada.",
        flags: ["Ephemeral"],
      });
      return;
    }

    const availableItems = await AvailableItems.findAll({
      where: { seasonId },
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

    const embeds = createPaginatedEmbeds(availableItems, season.season);

    await interaction.reply({
      embeds: [embeds[0]],
      components: embeds.length > 1 ? [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("prev")
            .setLabel("⬅️ Anterior")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId("page")
            .setLabel(`📖 ${1} / ${embeds.length}`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId("next")
            .setLabel("Próxima ➡️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(embeds.length <= 1),
        ),
      ] : [],
      flags: ["Ephemeral"],
    });

    const reply = await interaction.fetchReply()

    await handleEmbedPagination(interaction, reply, embeds);
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
