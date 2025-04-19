import { Client, Events } from "discord.js";
import { deployCommands } from "./deployCommands";
import { commands } from "./commands";
import { TradeRequestStatus } from "./utils/requestStatus";
import TradeRequest from "./models/tradeRequest.model";
import AvailableItem from "./models/availableItem.model";
import Item from "./models/item.model";
import Character from "./models/character.model";
import PurchaseRequest from "./models/purchaseRequest.model";

export const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
});

client.once(Events.ClientReady, () => {
  console.log("Discord bot is ready! 🤖");
});

client.on(Events.GuildCreate, async (guild) => {
  await deployCommands();
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = commands[interaction.commandName];
    if (command) {
      await command.execute(interaction);
    }
  }

  if (interaction.isAutocomplete()) {
    const command = commands[interaction.commandName];
    if (command?.autocomplete) {
      const focused = interaction.options.getFocused(true);
      await command.autocomplete(interaction);
    }
  }

  if (interaction.isModalSubmit()) {
    const [commandName] = interaction.customId.split(":");
    const command = commands[commandName];
    if (command?.modalSubmit) {
      await command.modalSubmit(interaction);
    }
  }

  if (interaction.isButton()) {
    const [action, type, requestIdStr] = interaction.customId.split("_");
    const requestId = parseInt(requestIdStr, 10);
  
    if (type === "trade") {
      const request = await TradeRequest.findByPk(requestId, {
        include: [
          { model: AvailableItem, include: [Item] },
          { model: Item, as: "itemOffered" },
          { model: Character },
        ],
      });
      console.log("request", request)
  
      if (!request) {
        await interaction.reply({ content: "🔁 Requisição de troca não encontrada.", ephemeral: true });
        return;
      }
  
      if (request.statusId !== TradeRequestStatus.PENDING) {
        await interaction.reply({
          content: "⚠️ Esta troca já foi processada anteriormente.",
          ephemeral: true,
        });
        return;
      }
  
      if (action === "approve") {
        const available = request.availableItemDesired;
  
        if (!available || available.quantity < 1) {
          request.statusId = TradeRequestStatus.OUT_OF_STOCK;
          await request.save();
          await interaction.reply({
            content: "❌ Não foi possível aprovar a troca: item desejado esgotado.",
            ephemeral: true,
          });
          return;
        }
  
        request.statusId = TradeRequestStatus.APPROVED;
        await request.save();
  
        available.quantity -= 1;
        await available.save();
  
        await interaction.reply({
          content: `✅ Troca aprovada com sucesso para **${request.character?.name}**!`,
          ephemeral: true,
        });
      }
  
      if (action === "reject") {
        request.statusId = TradeRequestStatus.REJECTED;
        await request.save();
        await interaction.reply({ content: "❌ Troca rejeitada.", ephemeral: true });
      }
    }
  
    if (type === "purchase") {
      const request = await PurchaseRequest.findByPk(requestId, {
        include: [
          { model: AvailableItem, include: [Item] },
          { model: Character },
        ],
      });
  
      if (!request) {
        await interaction.reply({ content: "🛒 Requisição de compra não encontrada.", ephemeral: true });
        return;
      }
  
      if (request.statusId !== TradeRequestStatus.PENDING) {
        await interaction.reply({
          content: "⚠️ Esta compra já foi processada anteriormente.",
          ephemeral: true,
        });
        return;
      }
  
      if (action === "approve") {
        const available = request.availableItem;
  
        if (!available || available.quantity < 1) {
          request.statusId = TradeRequestStatus.OUT_OF_STOCK;
          await request.save();
          await interaction.reply({
            content: "❌ Não foi possível aprovar a compra: item esgotado.",
            ephemeral: true,
          });
          return;
        }
  
        request.statusId = TradeRequestStatus.APPROVED;
        await request.save();
  
        available.quantity -= 1;
        await available.save();
  
        await interaction.reply({
          content: `✅ Compra aprovada com sucesso para **${request.character?.name}**!`,
          ephemeral: true,
        });
      }
  
      if (action === "reject") {
        request.statusId = TradeRequestStatus.REJECTED;
        await request.save();
        await interaction.reply({ content: "❌ Compra rejeitada.", ephemeral: true });
      }
    }
  }  
});