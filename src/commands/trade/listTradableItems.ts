import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
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

export default class ListTradableItemsOnCurrentSeasonCommand
  implements Command
{
  public data = new SlashCommandBuilder()
    .setName(STRING_COMMANDS.LIST_TRADABLE_ITEM_FROM_CURRENT_SEASON)
    .setDescription(
      "Lista os itens disponíveis para troca na temporada atual.",
    );

  public cooldown = new RateLimiter(1, 5000);

  public async execute(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const currentSeason = await Seasons.findOne({
      where: { isDeleted: false, isCurrent: true },
    });

    if (!currentSeason) {
      await interaction.reply({
        content: "Nenhuma temporada ativa foi encontrada.",
        flags: ["Ephemeral"],
      });
      return;
    }

    const items = await AvailableItems.findAll({
      where: {
        seasonId: currentSeason.id,
        canTrade: true,
        quantity: { [Op.gt]: 0 },
      },
      include: [{ model: Items, include: [Rarities] }],
      order: [["price", "ASC"]],
    });

    if (items.length === 0) {
      await interaction.reply({
        content: "Não há itens disponíveis para troca nesta temporada.",
        flags: ["Ephemeral"],
      });
      return;
    }

    const embeds = createPaginatedEmbeds(items, currentSeason.season);
    
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
}
