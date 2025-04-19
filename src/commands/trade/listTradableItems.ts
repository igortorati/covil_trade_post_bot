import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../commands";
import { RateLimiter } from "discord.js-rate-limiter";
import AvailableItems from "../../models/availableItem.model";
import Items from "../../models/item.model";
import Rarities from "../../models/rarity.model";
import Seasons from "../../models/season.model";
import { STRING_COMMANDS } from "..";

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

    const embed = new EmbedBuilder()
      .setTitle(
        `📦 Itens disponíveis para **troca** – Temporada: ${currentSeason.season}`,
      )
      .setColor("Gold");

    for (const available of items) {
      const item = available.item!;
      const rarity = item.rarity!;

      embed.addFields({
        name: `🧪 ${item.name} — *${rarity.namePt}*`,
        value: [
          `**💰 Preço:** ${available.price} PO`,
          `**📦 Quantidade disponível:** ${available.quantity}`,
          `\u200B`, // caractere invisível para espaçar visualmente
        ].join("\n"),
        inline: false,
      });
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
