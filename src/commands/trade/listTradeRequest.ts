import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  InteractionCollector,
  ComponentType,
  ButtonInteraction,
} from "discord.js";

import { Command } from "../commands";
import TradeRequests from "../../models/tradeRequest.model";
import AvailableItems from "../../models/availableItem.model";
import Items from "../../models/item.model";
import Characters from "../../models/character.model";
import Seasons from "../../models/season.model";
import Rarities from "../../models/rarity.model";
import { TradeRequestStatus } from "../../utils/requestStatus";
import { RateLimiter } from "discord.js-rate-limiter";
import { STRING_COMMANDS } from "..";

export default class ListTradeRequestsCommand implements Command {
  public data = new SlashCommandBuilder()
    .setName(STRING_COMMANDS.LIST_TRADE_REQUEST)
    .setDescription("Lista todas as requisições de troca pendentes.");

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

    const requests = await TradeRequests.findAll({
      where: { statusId: TradeRequestStatus.PENDING },
      include: [
        {
          model: AvailableItems,
          include: [{ model: Items, include: [Rarities] }],
        },
        {
          model: Items,
          as: "itemOffered",
          include: [Rarities],
        },
        {
          model: Characters,
        },
      ],
      limit: 5,
    });

    if (requests.length === 0) {
      await interaction.reply({
        content: "Nenhuma requisição de troca pendente.",
        flags: ["Ephemeral"],
      });
      return;
    }

    await interaction.reply({
      content: `🔁 Requisições de troca pendentes para a temporada **${season.season}**:`,
      flags: ["Ephemeral"],
    });

    for (const req of requests) {
      const desiredItem = req.availableItemDesired?.item;
      const offeredItem = req.itemOffered;
      const character = req.character;

      const fields = [
        {
          name: `🎯 Item Desejado`,
          value: `**${desiredItem?.name}** — *${desiredItem?.rarity?.namePt || desiredItem?.rarityId}*\nDisponíveis: ${req.availableItemDesired?.quantity}`,
          inline: false,
        },
        {
          name: `🎁 Item Oferecido`,
          value: `**${offeredItem?.name}** — *${offeredItem?.rarity?.namePt || offeredItem?.rarityId}*`,
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
      ];

      if (desiredItem?.category === "upgrade") {
        fields.push({
          name: "⚠️ Atenção",
          value:
            "**```🔴 Verifique se o jogador possui o item necessário ou ouro para comprá-lo.```**",
          inline: false,
        });
      }

      const embed = new EmbedBuilder()
        .setColor("#f39c12")
        .setTitle(`🔁 Requisição #${req.id}`)
        .addFields(...fields);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(`approve_trade_${req.id}`)
          .setLabel("✅ Aprovar")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`reject_trade_${req.id}`)
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
