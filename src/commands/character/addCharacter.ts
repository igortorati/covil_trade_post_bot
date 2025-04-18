import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  User,
} from "discord.js";
import { Command } from "../commands";
import { RateLimiter } from "discord.js-rate-limiter";
import Characters from "../../models/character.model";

export default class AddCharacterCommand implements Command {
  public data = new SlashCommandBuilder()
    .setName("adicionar-personagem")
    .setDescription("Adiciona um personagem para um usuário.")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("Usuário do Discord.")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("nome")
        .setDescription("Nome do personagem.")
        .setRequired(true),
    );

  public cooldown = new RateLimiter(1, 5000);

  public async execute(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const user: User = interaction.options.getUser("usuario", true);
    const nome = interaction.options.getString("nome", true);

    await Characters.create({
      discord_id: user.id,
      name: nome,
    } as Characters);

    await interaction.reply({
      content: `Personagem "${nome}" adicionado para o usuário ${user.tag}.`,
      flags: ["Ephemeral"],
    });
  }
}
