import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

import { Command } from "../commands";
import PurchaseRequests from "../../models/purchaseRequest.model";
import AvailableItems from "../../models/availableItem.model";
import Items from "../../models/item.model";
import Characters from "../../models/character.model";
import Seasons from "../../models/season.model";
import Rarities from "../../models/rarity.model";
import { TradeRequestStatus } from "../../utils/requestStatus";
import { RateLimiter } from "discord.js-rate-limiter";
import { STRING_COMMANDS } from "..";

export default class ListPurchaseRequestsCommand implements Command {
  public data = new SlashCommandBuilder()
    .setName(STRING_COMMANDS.LIST_PURCHASE_REQUEST)
    .setDescription("Lista todas as solicitações de compra pendentes.");

  public cooldown = new RateLimiter(1, 5000);

  public async execute(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const season = await Seasons.findOne({
      where: { isDeleted: false, isCurrent: true },
    });
    if (!season) {
      await interaction.reply({
        content: "Nenhuma temporada ativa encontrada.",
        flags: ["Ephemeral"],
      });
      return;
    }

    const requests = await PurchaseRequests.findAll({
      where: { statusId: TradeRequestStatus.PENDING },
      include: [
        {
          model: AvailableItems,
          include: [{ model: Items, include: [Rarities] }],
        },
        {
          model: Characters,
        },
      ],
      limit: 5
    });

    if (requests.length === 0) {
      await interaction.reply({
        content: "Nenhuma solicitação de compra pendente.",
        flags: ["Ephemeral"],
      });
      return;
    }

    await interaction.reply({
      content: `🛒 Solicitações de compra pendentes para a temporada **${season.season}**:`,
      flags: ["Ephemeral"],
    });

    for (const req of requests) {
      const item = req.availableItem?.item;
      const character = req.character;

      const fields = [
        {
          name: `📦 Item`,
          value: `**${item?.name}** — *${item?.rarity?.namePt || item?.rarityId}*\nDisponíveis: ${req.availableItem?.quantity}`,
          inline: false,
        },
        {
          name: `👤 Personagem`,
          value: `${character?.name}`,
          inline: true,
        },
        {
          name: `📅 Temporada`,
          value: season.season,
          inline: true,
        },
      ]
      
      if (item?.category === "upgrade") {
        fields.push({
          name: "⚠️ Atenção",
          value: "**```🔴 Verifique se o jogador possui o item necessário ou ouro para comprá-lo.```**",
          inline: false,
        });
      }

      const embed = new EmbedBuilder()
        .setColor("#27ae60")
        .setTitle(`🛒 Solicitação de Compra #${req.id}`)
        .addFields(...fields);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(`approve_purchase_${req.id}`)
          .setLabel("✅ Aprovar")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`reject_purchase_${req.id}`)
          .setLabel("❌ Rejeitar")
          .setStyle(ButtonStyle.Danger),
      );

      await interaction.followUp({
        embeds: [embed],
        components: [row],
        flags: ["Ephemeral"],
      });
    }
  }
}
