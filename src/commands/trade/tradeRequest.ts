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
import TradeRequests from "../../models/tradeRequest.model";
import { Op } from "sequelize";
import TradeRequest from "../../models/tradeRequest.model";
import { TradeRequestStatus } from "../../utils/requestStatus";
import Rarities from "../../models/rarity.model";
import { getAllowedRaritiesFrom } from "../../utils/raritiesToSearch";
import { STRING_COMMANDS } from "..";

export default class TradeRequestCommand implements Command {
  public data = new SlashCommandBuilder()
    .setName(STRING_COMMANDS.TRADE)
    .setDescription("Solicita uma troca de itens.")
    .addStringOption((option) =>
      option
        .setName("personagem")
        .setDescription("Selecione o personagem.")
        .setRequired(true)
        .setAutocomplete(true),
    )
    .addStringOption((option) =>
      option
        .setName("item_desejado")
        .setDescription("Selecione o item desejado.")
        .setRequired(true)
        .setAutocomplete(true),
    )
    .addStringOption((option) =>
      option
        .setName("item_oferecido")
        .setDescription("Selecione o item que deseja oferecer.")
        .setRequired(true)
        .setAutocomplete(true),
    );

  public cooldown = new RateLimiter(1, 5000);

  public async execute(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const userId = interaction.user.id;
    const characterId = interaction.options.getString("personagem", true);
    const desiredItemId = interaction.options.getString("item_desejado", true);
    const offeredItemId = interaction.options.getString("item_oferecido", true);

    const character = await Characters.findOne({
      where: { id: characterId, discordId: userId },
    });

    if (!character) {
      await interaction.reply({
        content: "Personagem não encontrado ou não pertence a você.",
        flags: ["Ephemeral"],
      });
      return;
    }

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

    const availableItem = await AvailableItems.findOne({
      where: {
        id: desiredItemId,
        seasonId: currentSeason.id,
        canTrade: true,
      },
      include: {
        model: Items,
        include: [Rarities],
      },
    });

    if (!availableItem || !availableItem.item) {
      await interaction.reply({
        content:
          "Item desejado não está disponível para troca nesta temporada.",
        flags: ["Ephemeral"],
      });
      return;
    }

    const offeredItem = await Items.findByPk(offeredItemId, {
      include: [Rarities],
    });

    if (!offeredItem) {
      await interaction.reply({
        content: `Item oferecido não encontrado ou possui raridade inferior ao item desejado (${availableItem.item.name} – ${availableItem.item.rarity?.namePt}).`,
        flags: ["Ephemeral"],
      });
      return;
    }

    await TradeRequests.create({
      characterId: character.id,
      availableItemDesiredId: availableItem.id,
      itemOfferedId: offeredItem.id,
      statusId: TradeRequestStatus.PENDING,
    } as TradeRequest);

    const embed = new EmbedBuilder()
      .setTitle("🔁 Requisição de Troca Registrada")
      .setColor("#3498db")
      .addFields(
        {
          name: `🎯 Item Desejado: 🧪 ${availableItem.item.name} — *${availableItem.item.rarity?.namePt || availableItem.item.rarityId}*`,
          value: [
            `**📦 Quantidade disponível:** ${availableItem.quantity}`,
            `**💰 Valor estimado:** ${availableItem.price} PO`,
            `\u200B`,
          ].join("\n"),
          inline: false,
        },
        {
          name: `🎁 Item Oferecido: 🧪 ${offeredItem.name} — *${offeredItem.rarity?.namePt || offeredItem.rarityId}*`,
          value: `Este item será avaliado pelos administradores para validar a troca.`,
          inline: false,
        },
      )
      .setFooter({ text: `Personagem: ${character.name}` })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      flags: ["Ephemeral"],
    });
  }

  public async autocomplete(
    interaction: AutocompleteInteraction,
  ): Promise<void> {
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
          canTrade: true,
        },
        include: [
          {
            model: Items,
            where: {
              name: { [Op.like]: `%${value}%` },
            },
            include: [Rarities],
          },
        ],
        limit: 25,
      });

      const choices = availableItems.map((ai) => ({
        name: ai.item!.name,
        value: ai.id.toString(),
      }));

      await interaction.respond(choices);
    } else if (focusedOption.name === "item_oferecido") {
      const desiredAvailableItemId =
        interaction.options.getString("item_desejado");
      let items = [];

      if (desiredAvailableItemId) {
        const desiredAvailableItem = await AvailableItems.findOne({
          where: {
            id: desiredAvailableItemId,
          },
          include: [{ model: Items, include: ["rarity"] }],
        });

        const desiredItem = desiredAvailableItem?.item;

        let rarityFilter: string[] = [];

        if (desiredItem?.rarityId) {
          rarityFilter = await getAllowedRaritiesFrom(desiredItem.rarityId);
        }

        items = await Items.findAll({
          where: {
            name: { [Op.like]: `%${value}%` },
            ...(rarityFilter.length > 0 && {
              rarityId: {
                [Op.in]: rarityFilter,
              },
            }),
          },
          limit: 25,
        });
      } else {
        items = await Items.findAll();
      }
      const choices = items.map((item) => ({
        name: item.name,
        value: item.id.toString(),
      }));
      await interaction.respond(choices);
    }
  }
}
