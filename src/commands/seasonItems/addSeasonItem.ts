import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
} from "discord.js";
import { Command } from "../commands";
import { RateLimiter } from "discord.js-rate-limiter";
import Items from "../../models/item.model";
import Seasons from "../../models/season.model";
import AvailableItems from "../../models/availableItem.model";
import { Op } from "sequelize";

export default class AddSeasonItemCommand implements Command {
  public data = new SlashCommandBuilder()
    .setName("adicionar-item")
    .setDescription("Adiciona um item disponível para uma temporada.")
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("Item a ser adicionado.")
        .setRequired(true)
        .setAutocomplete(true),
    )
    .addStringOption((option) =>
      option
        .setName("temporada")
        .setDescription("Temporada para a qual o item será adicionado.")
        .setRequired(true)
        .setAutocomplete(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("quantidade")
        .setDescription("Quantidade disponível do item.")
        .setRequired(true),
    )
    .addNumberOption((option) =>
      option
        .setName("preco")
        .setDescription("Preço do item em PO.")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("permite_troca")
        .setDescription("Este item pode ser trocado?")
        .setRequired(true)
        .addChoices(
          { name: "Sim", value: "sim" },
          { name: "Não", value: "nao" },
        ),
    );

  public cooldown = new RateLimiter(1, 5000);

  public async execute(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const itemId = interaction.options.getString("item", true);
    const seasonId = interaction.options.getString("temporada", true);
    const quantidade = interaction.options.getInteger("quantidade", true);
    const preco = interaction.options.getNumber("preco", true);
    const permiteTrocaRaw = interaction.options.getString(
      "permite_troca",
      true,
    );

    const item = await Items.findByPk(itemId);
    const season = await Seasons.findByPk(seasonId);

    if (!item || !season) {
      await interaction.reply({
        content: "Item ou temporada não encontrados.",
        flags: ["Ephemeral"],
      });
      return;
    }

    const permiteTroca = permiteTrocaRaw === "sim";

    await AvailableItems.create({
      item_id: item.id,
      season_id: season.id,
      quantity: quantidade,
      price: preco,
      can_trade: permiteTroca,
    } as AvailableItems);

    await interaction.reply({
      content: `Item "${item.name}" adicionado à temporada "${season.season}" com sucesso!\nQuantidade: ${quantidade}, Preço: ${preco} PO, Permite Troca: ${permiteTroca ? "Sim" : "Não"}`,
      flags: ["Ephemeral"],
    });
  }

  public async autocomplete(
    interaction: AutocompleteInteraction,
  ): Promise<void> {
    const focusedOption = interaction.options.getFocused(true);
    const value = focusedOption.value?.toString().trim();

    if (focusedOption.name === "item") {
      const items = await Items.findAll({
        where: {
          name: { [Op.like]: `%${value}%` },
        },
        limit: 25,
      });
      const choices = items.map((item) => ({
        name: item.name,
        value: item.id.toString(),
      }));
      await interaction.respond(choices);
    } else if (focusedOption.name === "temporada") {
      const seasons = await Seasons.findAll({
        where: {
          is_deleted: false,
          season: { [Op.like]: `%${value}%` },
        },
        limit: 25,
      });
      const choices = seasons.map((season) => ({
        name: season.season,
        value: season.id.toString(),
      }));
      await interaction.respond(choices);
    }
  }
}
