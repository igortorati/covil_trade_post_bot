import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
} from "discord.js";
import { Command } from "../commands";
import { RateLimiter } from "discord.js-rate-limiter";
import AvailableItems from "../../models/availableItem.model";
import Items from "../../models/item.model";
import Seasons from "../../models/season.model";
import { Op } from "sequelize";

export default class EditSeasonItemCommand implements Command {
  public data = new SlashCommandBuilder()
    .setName("editar-item")
    .setDescription("Edita os detalhes de um item disponível.")
    .addIntegerOption((option) =>
      option.setName("id").setDescription("ID do item a ser editado.").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("item")
        .setDescription("Novo item (opcional).")
        .setAutocomplete(true)
        .setRequired(false)
    )
    .addStringOption((option) =>
      option.setName("temporada")
        .setDescription("Nova temporada (opcional).")
        .setAutocomplete(true)
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option.setName("quantidade")
        .setDescription("Nova quantidade (opcional).")
        .setRequired(false)
    )
    .addNumberOption((option) =>
      option.setName("preco")
        .setDescription("Novo preço (opcional).")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option.setName("permite_troca")
        .setDescription("Permite troca?")
        .addChoices(
          { name: "Sim", value: "sim" },
          { name: "Não", value: "nao" }
        )
        .setRequired(false)
    );

  public cooldown = new RateLimiter(1, 5000);

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const id = interaction.options.getInteger("id", true);

    const availableItem = await AvailableItems.findByPk(id);
    if (!availableItem) {
      await interaction.reply({ content: "Item disponível não encontrado.", flags: ["Ephemeral"] });
      return;
    }

    const newItemId = interaction.options.getString("item");
    const newSeasonId = interaction.options.getString("temporada");
    const newQuantidade = interaction.options.getInteger("quantidade");
    const newPreco = interaction.options.getNumber("preco");
    const trocaStr = interaction.options.getString("permite_troca");
    console.log("!!trocaStr", !!trocaStr)
    console.log("!!trocaStr ? trocaStr === \"sim\" : availableItem.can_trade", !!trocaStr ? trocaStr === "sim" : availableItem.can_trade)

    const item = newItemId ? await Items.findByPk(newItemId) : await Items.findByPk(availableItem.item_id);
    const season = newSeasonId ? await Seasons.findByPk(newSeasonId) : await Seasons.findByPk(availableItem.season_id);

    if (!item || !season) {
      await interaction.reply({ content: "Item ou temporada não encontrados.", flags: ["Ephemeral"] });
      return;
    }

    await availableItem.update({
      item_id: item.id,
      season_id: season.id,
      quantity: newQuantidade ?? availableItem.quantity,
      price: newPreco ?? availableItem.price,
      can_trade: !!trocaStr ? trocaStr === "sim" : availableItem.can_trade,
    });

    await interaction.reply({
      content: `Item #${id} atualizado com sucesso.\nItem: ${item.name}\nTemporada: ${season.season}\nQuantidade: ${newQuantidade ?? availableItem.quantity}\nPreço: ${newPreco ?? availableItem.price}\nPermite Troca: ${(!!trocaStr ? trocaStr === "sim" : availableItem.can_trade) ? "Sim" : "Não"}`,
      flags: ["Ephemeral"]
    });
  }

  public async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
    const focusedOption = interaction.options.getFocused(true);
    const value = focusedOption.value?.toString().trim();

    if (focusedOption.name === "item") {
      const items = await Items.findAll({
        where: {
          name: { [Op.like]: `%${value}%` }
        },
        limit: 25
      });
      const choices = items.map((item) => ({ name: item.name, value: item.id.toString() }));
      await interaction.respond(choices);
    } else if (focusedOption.name === "temporada") {
      const seasons = await Seasons.findAll({
        where: {
          is_deleted: false,
          season: { [Op.like]: `%${value}%` }
        },
        limit: 25
      });
      const choices = seasons.map((season) => ({ name: season.season, value: season.id.toString() }));
      await interaction.respond(choices);
    }
  }
}
