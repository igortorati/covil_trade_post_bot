import { Events } from "discord.js";
import { client } from "../config/client";
import { TradeRequestStatus } from "../utils/requestStatus";
import TradeRequest from "../models/tradeRequest.model";
import AvailableItem from "../models/availableItem.model";
import Item from "../models/item.model";
import Character from "../models/character.model";
import PurchaseRequest from "../models/purchaseRequest.model";

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isButton()) {
    const [action, type, requestIdStr] = interaction.customId.split("_");
    const requestId = parseInt(requestIdStr, 10);
    const userId = interaction.user.id;

    if (type === "trade") {
      const request = await TradeRequest.findByPk(requestId, {
        include: [
          { model: AvailableItem, include: [Item] },
          { model: Item, as: "itemOffered" },
          { model: Character },
        ],
      });

      if (!request) {
        await interaction.reply({
          content: "🔁 Requisição de troca não encontrada.",
          flags: ["Ephemeral"],
        });
        return;
      }

      if (request.statusId !== TradeRequestStatus.PENDING) {
        await interaction.reply({
          content: "⚠️ Esta troca já foi processada anteriormente.",
          flags: ["Ephemeral"],
        });
        return;
      }

      if (action === "approve") {
        const available = request.availableItemDesired;
        if (!available || available.quantity < 1) {
          request.statusId = TradeRequestStatus.OUT_OF_STOCK;
          request.updatedBy = userId;
          await request.save();
          await interaction.reply({
            content: "❌ Não foi possível aprovar a troca: item desejado esgotado.",
            flags: ["Ephemeral"],
          });
          return;
        }

        request.statusId = TradeRequestStatus.APPROVED;
        request.updatedBy = userId;
        await request.save();
        available.quantity -= 1;
        await available.save();

        await interaction.reply({
          content: `✅ Troca aprovada com sucesso para **${request.character?.name}**!`,
          flags: ["Ephemeral"],
        });
      }

      if (action === "reject") {
        request.statusId = TradeRequestStatus.REJECTED;
        request.updatedBy = userId;
        await request.save();
        await interaction.reply({
          content: "❌ Troca rejeitada.",
          flags: ["Ephemeral"],
        });
      }
    }

    if (type === "purchase") {
      const request = await PurchaseRequest.findByPk(requestId, {
        include: [{ model: AvailableItem, include: [Item] }, { model: Character }],
      });

      if (!request) {
        await interaction.reply({
          content: "🛒 Requisição de compra não encontrada.",
          flags: ["Ephemeral"],
        });
        return;
      }

      if (request.statusId !== TradeRequestStatus.PENDING) {
        await interaction.reply({
          content: "⚠️ Esta compra já foi processada anteriormente.",
          flags: ["Ephemeral"],
        });
        return;
      }

      if (action === "approve") {
        const available = request.availableItem;
        if (!available || available.quantity < 1) {
          request.statusId = TradeRequestStatus.OUT_OF_STOCK;
          request.updatedBy = userId;
          await request.save();
          await interaction.reply({
            content: "❌ Não foi possível aprovar a compra: item esgotado.",
            flags: ["Ephemeral"],
          });
          return;
        }

        request.statusId = TradeRequestStatus.APPROVED;
        request.updatedBy = userId;
        await request.save();
        available.quantity -= 1;
        await available.save();

        await interaction.reply({
          content: `✅ Compra aprovada com sucesso para **${request.character?.name}**!`,
          flags: ["Ephemeral"],
        });
      }

      if (action === "reject") {
        request.statusId = TradeRequestStatus.REJECTED;
        request.updatedBy = userId;
        await request.save();
        await interaction.reply({
          content: "❌ Compra rejeitada.",
          flags: ["Ephemeral"],
        });
      }
    }
  }
});