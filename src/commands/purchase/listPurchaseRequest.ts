import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ComponentType,
  Message,
  ButtonInteraction,
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
import { config } from "../../config/config";

export default class ListPurchaseRequestsCommand implements Command {
  public data = new SlashCommandBuilder()
    .setName(STRING_COMMANDS.LIST_PURCHASE_REQUEST)
    .setDescription("Lista todas as solicitações de compra pendentes.");

  public cooldown = new RateLimiter(1, 5000);

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const season = await Seasons.findOne({ where: { isDeleted: false, isCurrent: true } });
    if (!season) {
      await interaction.reply({ content: "Nenhuma temporada ativa encontrada.", flags: 64 });
      return;
    }

    const requests = await PurchaseRequests.findAll({
      where: { statusId: TradeRequestStatus.PENDING },
      include: [
        { model: AvailableItems, include: [{ model: Items, include: [Rarities] }] },
        { model: Characters },
      ],
      order: [["id", "ASC"]],
    });

    if (requests.length === 0) {
      await interaction.reply({ content: "Nenhuma solicitação de compra pendente.", flags: 64 });
      return;
    }

    const createEmbed = (req: PurchaseRequests) => {
      const desiredItem = req.availableItem?.item;
      const character = req.character;

      const fields = [
        {
          name: "📦 Item",
          value: `**${desiredItem?.name}** — *${desiredItem?.rarity?.namePt || desiredItem?.rarityId}*\nDisponíveis: ${req.availableItem?.quantity}`,
          inline: false,
        },
        { name: "👤 Personagem", value: character?.name ?? "Desconhecido", inline: true },
        { name: "📅 Temporada", value: season.season, inline: true },
      ];

      if (desiredItem?.category === "upgrade") {
        fields.push({
          name: "⚠️ Atenção",
          value: "**```🔴 Verifique se o jogador possui o item necessário ou ouro para comprá-lo.```**",
          inline: false,
        });
      }

      if (req.statusId !== TradeRequestStatus.PENDING) {
        fields.push({
          name: "ℹ️ Avaliado",
          value: `Esta solicitação já foi ${req.statusId === TradeRequestStatus.APPROVED ? "aprovada ✅" : "rejeitada ❌"}`,
          inline: false,
        });
      }

      return new EmbedBuilder()
        .setColor(req.statusId === TradeRequestStatus.PENDING ? "#f39c12" : "#95a5a6")
        .setTitle(`🛒 Solicitação de Compra #${req.id}`)
        .addFields(...fields);
    };

    const embeds = requests.map(createEmbed);
    let currentPage = 0;

    const getActionRows = () => {
      const req = requests[currentPage];

      const actionRow1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(`approve_${req.id}`)
          .setLabel("✅ Aprovar")
          .setStyle(ButtonStyle.Success)
          .setDisabled(req.statusId !== TradeRequestStatus.PENDING),
        new ButtonBuilder()
          .setCustomId(`reject_${req.id}`)
          .setLabel("❌ Rejeitar")
          .setStyle(ButtonStyle.Danger)
          .setDisabled(req.statusId !== TradeRequestStatus.PENDING),
      );

      const actionRow2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("prev")
          .setLabel("⬅️ Anterior")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(currentPage === 0),
        new ButtonBuilder()
          .setCustomId("page")
          .setLabel(`📖 ${currentPage + 1} / ${embeds.length}`)
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel("Próxima ➡️")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(currentPage === embeds.length - 1),
      );

      return [actionRow1, actionRow2];
    };

    await interaction.reply({
      embeds: [embeds[currentPage]],
      components: getActionRows(),
    });

    const reply = await interaction.fetchReply();

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 1000 * 60 * config.app.embedSessionDuration,
    });

    collector.on("collect", async (btnInt: ButtonInteraction) => {
      if (btnInt.user.id !== interaction.user.id) {
        await btnInt.reply({
          content: "⚠️ Apenas quem executou o comando pode usar esses botões.",
        });
        return;
      }

      const req = requests[currentPage];

      if (btnInt.customId === "prev") {
        if (currentPage > 0) currentPage--;
        await btnInt.update({ embeds: [embeds[currentPage]], components: getActionRows() });
        return;
      }

      if (btnInt.customId === "next") {
        if (currentPage < embeds.length - 1) currentPage++;
        await btnInt.update({ embeds: [embeds[currentPage]], components: getActionRows() });
        return;
      }

      if (btnInt.customId.startsWith("approve_")) {
        if (req.statusId !== TradeRequestStatus.PENDING) {
          await btnInt.reply({
            content: "⚠️ Esta solicitação já foi avaliada.",
          });
          return;
        }
        const availableItem = await AvailableItems.findByPk(req.availableItem?.id);
        if (!availableItem) {
          await btnInt.reply({
            content: "⚠️ Não foi possível realizar a operação, o item desejado não foi encontrado.",
          });
          return;
        }
        availableItem.quantity--;
        await availableItem.save();

        req.statusId = TradeRequestStatus.APPROVED;
        await req.save();
        embeds[currentPage] = createEmbed(req);
        await btnInt.update({ embeds: [embeds[currentPage]], components: getActionRows() });
        return;
      }

      if (btnInt.customId.startsWith("reject_")) {
        if (req.statusId !== TradeRequestStatus.PENDING) {
          await btnInt.reply({
            content: "⚠️ Esta solicitação já foi avaliada.",
          });
          return;
        }

        req.statusId = TradeRequestStatus.REJECTED;
        await req.save();
        embeds[currentPage] = createEmbed(req);
        await btnInt.update({ embeds: [embeds[currentPage]], components: getActionRows() });
        return;
      }
    });

    collector.on("end", async () => {
      await interaction.editReply({ components: [] });
    });
  }
}
