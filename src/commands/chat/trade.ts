import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  TextInputComponent,
  ModalSubmitInteraction,
  TextChannel,
  NewsChannel,
  DMChannel,
  ThreadChannel,
  AutocompleteInteraction,
} from "discord.js";
import { Command } from "../commands";

enum Personagens {
  NARUTO = "Naruto Uzumaki",
  SASUKE = "Sasuke Uchiha",
  SAKURA = "Sakura Haruno",
  KAKASHI = "Kakashi Hatake",
}

enum Itens {
  KUNAI = "Kunai",
  SHURIKEN = "Shuriken",
  MAKIMONO = "Pergaminho Secreto",
  RAMEN = "Ramen do Ichiraku",
  BYAKUGAN = "Byakugan Falso",
  SHARINGAN = "Sharingan de Vidro",
}

export default class TradeCommand implements Command {
  data = new SlashCommandBuilder()
    .setName("troca")
    .setDescription("Envie uma sugestão para o servidor")
    .addStringOption(option =>
      option
        .setName("personagem")
        .setDescription("Escolha um personagem")
        .setAutocomplete(true)
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("item_desejado")
        .setDescription("Item que você deseja receber")
        .setAutocomplete(true)
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("item_oferecido")
        .setDescription("Item que você oferece na troca")
        .setAutocomplete(true)
        .setRequired(true)
    );

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const personagem = interaction.options.getString("personagem", true);
    const itemDesejado = interaction.options.getString("item_desejado", true);
    const itemOferecido = interaction.options.getString("item_oferecido", true);

    await interaction.reply(
      `🌀 **Troca registrada**\n👤 Personagem: **${personagem}**\n📥 Item desejado: **${itemDesejado}**\n📤 Item oferecido: **${itemOferecido}**`
    );
  }

  async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
    const focused = interaction.options.getFocused(true);
    const query = interaction.options.getFocused(true).value.toLowerCase();
    let choices: { name: string; value: string }[] = [];

    switch (focused.name) {
      case "personagem":
        choices = Object.entries(Personagens)
          .map(([key, name]) => ({ name, value: key }))
          .filter(choice => choice.name.toLowerCase().includes(query))
          .slice(0, 25);
        break;
      case "item_desejado":
      case "item_oferecido":
        choices = Object.entries(Itens)
          .map(([key, name]) => ({ name, value: key }))
          .filter(choice => choice.name.toLowerCase().includes(query))
          .slice(0, 25);
        break;
    }

    await interaction.respond(choices);
  }
}
