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

enum Frutas {
  MACA = "Maçã",
  BANANA = "Banana",
  UVA = "Uva",
  LARANJA = "Laranja",
  MANGA = "Manga",
  ABACAXI = "Abacaxi",
  MORANGO = "Morango",
}

export default class SugestaoCommand implements Command {
  data = new SlashCommandBuilder()
    .setName("sugestao")
    .setDescription("Envie uma sugestão para o servidor")
    .addStringOption(option =>
      option
        .setName("fruta")
        .setDescription("Escolha uma fruta")
        .setAutocomplete(true)
        .setRequired(true)
    );

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const frutaSelecionada = interaction.options.getString("fruta", true);

    const modal = new ModalBuilder()
      .setCustomId(`sugestao:modal|${frutaSelecionada}`) // fruta embutida
      .setTitle("Nova Sugestão");

    const titulo = new TextInputBuilder()
      .setCustomId("titulo")
      .setLabel("Título da sugestão")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const descricao = new TextInputBuilder()
      .setCustomId("descricao")
      .setLabel("Descreva sua sugestão")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(titulo),
      new ActionRowBuilder<TextInputBuilder>().addComponents(descricao)
    );

    await interaction.showModal(modal);
  }

  async modalSubmit(interaction: ModalSubmitInteraction): Promise<void> {
    const [customId, frutaKey] = interaction.customId.split("|");
    const fruta = Frutas[frutaKey.toUpperCase() as keyof typeof Frutas];

    const titulo = interaction.fields.getTextInputValue("titulo");
    const descricao = interaction.fields.getTextInputValue("descricao");
    const channel = interaction.channel;

    console.log("fruta", fruta)
    console.log("descricao", descricao)

    if (
      channel instanceof TextChannel ||
      channel instanceof NewsChannel ||
      channel instanceof DMChannel ||
      channel instanceof ThreadChannel
    ) {
      await channel.send({
        content: `📝 Nova sugestão de **${interaction.user.tag}**\n🍉 Fruta: **${fruta}**\n📌 **${titulo}**\n${descricao}`,
      });

      await interaction.reply({
        content: "Sugestão enviada com sucesso!"
      });
    } else {
      await interaction.reply({
        content: "Não foi possível enviar a sugestão neste canal."
      });
    }
  }

  async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
    const query = interaction.options.getFocused(true).value.toLowerCase();
  
    const choices = Object.entries(Frutas)
      .map(([key, name]) => ({ name, value: key }))
      .filter(choice => choice.name.toLowerCase().includes(query))
      .slice(0, 25);
  
    await interaction.respond(choices);
  }
}
