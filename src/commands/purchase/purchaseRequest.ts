import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../commands";
import { RateLimiter } from "discord.js-rate-limiter";
import Characters from "../../models/character.model";
import AvailableItems from "../../models/availableItem.model";
import Items from "../../models/item.model";
import Seasons from "../../models/season.model";
import PurchaseRequest from "../../models/purchaseRequest.model";
import { Op } from "sequelize";
import { TradeRequestStatus } from "../../utils/requestStatus";
import { STRING_COMMANDS } from "..";

export default class PurchaseRequestCommand implements Command {
  public data = new SlashCommandBuilder()
    .setName(STRING_COMMANDS.PURCHASE)
    .setDescription("Solicita a compra de um item.")
    .addStringOption((option) =>
      option
        .setName("personagem")
        .setDescription("Selecione o personagem.")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption((option) =>
      option
        .setName("item_desejado")
        .setDescription("Selecione o item desejado para compra.")
        .setRequired(true)
        .setAutocomplete(true)
    );

  public cooldown = new RateLimiter(1, 5000);

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const userId = interaction.user.id;
    const characterId = interaction.options.getString("personagem", true);
    const desiredItemId = interaction.options.getString("item_desejado", true);

    // Verifica se o personagem pertence ao usuário
    const character = await Characters.findOne({
      where: { id: characterId, discordId: userId },
    });

    if (!character) {
      await interaction.reply({
        content: "Personagem não encontrado ou não pertence a você.",
        ephemeral: true,
      });
      return;
    }

    const currentSeason = await Seasons.findOne({
      where: { isDeleted: false, isCurrent: true },
    });

    if (!currentSeason) {
      await interaction.reply({
        content: "Nenhuma temporada ativa foi encontrada.",
        ephemeral: true,
      });
      return;
    }

    const availableItem = await AvailableItems.findOne({
      where: {
        id: desiredItemId,
        seasonId: currentSeason.id,
      },
      include: [Items],
    });

    if (!availableItem || !availableItem.item) {
      await interaction.reply({
        content: "Item não está disponível para compra nesta temporada.",
        ephemeral: true,
      });
      return;
    }

    await PurchaseRequest.create({
      characterId: character.id,
      availableItemId: availableItem.id,
      statusId: TradeRequestStatus.PENDING,
    } as PurchaseRequest);

    const embed = new EmbedBuilder()
      .setTitle("🛒 Requisição de Compra Registrada")
      .setColor("#2ecc71")
      .addFields({
        name: `🧪 ${availableItem.item.name} — *${availableItem.item.rarityId}*`,
        value: [
          `**💰 Preço:** ${availableItem.price} PO`,
          `**📦 Quantidade disponível:** ${availableItem.quantity}`,
          `\u200B`,
        ].join("\n"),
        inline: false,
      })
      .setFooter({ text: `Personagem: ${character.name}` })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  }

  public async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
    const focusedOption = interaction.options.getFocused(true);
    const userId = interaction.user.id;
    const value = focusedOption.value.toString();

    if (focusedOption.name === "personagem") {
      const characters = await Characters.findAll({
        where: {
          discordId: userId,
          name: { [Op.like]: `%${value}%` },
        },
        limit: 25,
      });

      const choices = characters.map((char) => ({
        name: char.name,
        value: char.id.toString(),
      }));

      await interaction.respond(choices);
    } else if (focusedOption.name === "item_desejado") {
      const currentSeason = await Seasons.findOne({
        where: { isDeleted: false, isCurrent: true },
      });

      if (!currentSeason) {
        await interaction.respond([]);
        return;
      }

      const availableItems = await AvailableItems.findAll({
        where: {
          seasonId: currentSeason.id,
        },
        include: [
          {
            model: Items,
            where: {
              name: { [Op.like]: `%${value}%` },
            },
          },
        ],
        limit: 25,
      });

      const choices = availableItems.map((ai) => ({
        name: ai.item!.name,
        value: ai.id.toString(),
      }));

      await interaction.respond(choices);
    }
  }
}
