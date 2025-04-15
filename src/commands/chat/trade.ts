import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  ApplicationCommandOptionChoiceData,
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

enum Cores {
  VERMELHO = "Vermelho",
  AZUL = "Azul",
  VERDE = "Verde",
  AMARELO = "Amarelo",
  PRETO = "Preto",
  BRANCO = "Branco",
  CINZA = "Cinza",
}

enum Animais {
  GATO = "Gato",
  CACHORRO = "Cachorro",
  PASSARO = "Pássaro",
  PEIXE = "Peixe",
  CAVALO = "Cavalo",
  TIGRE = "Tigre",
}

export default class TradeCommand implements Command {
  data = new SlashCommandBuilder()
    .setName("troca")
    .setDescription("Envie uma sugestão para o servidor")
    .addStringOption(option =>
      option
        .setName("fruta")
        .setDescription("Escolha uma fruta")
        .setAutocomplete(true)
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("cor")
        .setDescription("Escolha uma cor")
        .setAutocomplete(true)
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("animal")
        .setDescription("Escolha um animal")
        .setAutocomplete(true)
        .setRequired(true)
    );

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const frutaSelecionada = interaction.options.getString("fruta", true);
    const corSelecionada = interaction.options.getString("cor", true);
    const animalSelecionado = interaction.options.getString("animal", true);

    await interaction.reply({
      content: `Sugestão enviada com as seguintes escolhas:\n🍉 Fruta: **${frutaSelecionada}**\n🎨 Cor: **${corSelecionada}**\n🐾 Animal: **${animalSelecionado}**`,
    });
  }

  async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
    const focusedOption = interaction.options.getFocused(true);
    const query = focusedOption.value.toLowerCase();
    const name = focusedOption.name;
  
    let choices: { name: string, value: string }[] = [];
  
    switch (name) {
      case "fruta":
        choices = Object.entries(Frutas)
          .map(([key, name]) => ({ name, value: key }))
          .filter(choice => choice.name.toLowerCase().includes(query))
          .slice(0, 25);
        break;
      case "cor":
        choices = Object.entries(Cores)
          .map(([key, name]) => ({ name, value: key }))
          .filter(choice => choice.name.toLowerCase().includes(query))
          .slice(0, 25);
        break;
      case "animal":
        choices = Object.entries(Animais)
          .map(([key, name]) => ({ name, value: key }))
          .filter(choice => choice.name.toLowerCase().includes(query))
          .slice(0, 25);
        break;
    }
  
    await interaction.respond(choices);
  }
  
}
