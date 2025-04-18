import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { Command } from "../commands";
import { RateLimiter } from "discord.js-rate-limiter";
import AvailableItems from "../../models/availableItem.model";

export default class RemoveSeasonItemCommand implements Command {
  public data = new SlashCommandBuilder()
    .setName("remover-item")
    .setDescription("Remove um item disponível.")
    .addIntegerOption((option) =>
      option
        .setName("id")
        .setDescription("ID do item a ser removido.")
        .setRequired(true)
    );

  public cooldown = new RateLimiter(1, 5000);

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const id = interaction.options.getInteger("id", true);

    const availableItem = await AvailableItems.findByPk(id);
    if (!availableItem) {
      await interaction.reply({ content: "Item não encontrado.", flags: ["Ephemeral"] });
      return;
    }

    await availableItem.destroy();
    await interaction.reply({ content: `Item com ID ${id} removido com sucesso.`, flags: ["Ephemeral"] });
  }
}
