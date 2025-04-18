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

export default class ListPurchasableItemsOnCurrentSeasonCommand implements Command {
  public data = new SlashCommandBuilder()
    .setName("listar-itens-compraveis")
    .setDescription("Lista os itens disponíveis para compra na temporada atual.");

  public cooldown = new RateLimiter(1, 5000);

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const currentSeason = await Seasons.findOne({
      where: { is_deleted: false, is_current: true },
    });

    if (!currentSeason) {
      await interaction.reply({ content: "Nenhuma temporada ativa foi encontrada.", flags: ["Ephemeral"] });
      return;
    }

    const items = await AvailableItems.findAll({
      where: {
        season_id: currentSeason.id,
      },
      include: [{ model: Items, include: [Rarities] }],
      order: [["price", "ASC"]],
    });

    if (items.length === 0) {
      await interaction.reply({ content: "Não há itens disponíveis para compra nesta temporada.", flags: ["Ephemeral"] });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`🛒 Itens disponíveis para **compra** – Temporada: ${currentSeason.season}`)
      .setColor("Green");

    for (const available of items) {
      const item = available.item!;
      const rarity = item.rarity!;

      embed.addFields({
        name: `🧪 ${item.name} — *${rarity.name_pt}*`,
        value: [
          `**💰 Preço:** ${available.price} PO`,
          `**📦 Quantidade disponível:** ${available.quantity}`,
          `**🔁 Permite troca:** ${available.can_trade ? "Sim" : "Não"}`,
          `\u200B`
        ].join("\n"),
        inline: false,
      });
    }

    await interaction.reply({ embeds: [embed], flags: ["Ephemeral"] });
  }
}
