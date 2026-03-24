import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  ChatInputCommandInteraction,
  Message,
  EmbedBuilder,
} from "discord.js";
import { config } from "../config/config";

export async function handleEmbedPagination(
  interaction: ChatInputCommandInteraction,
  reply: Message,
  embeds: EmbedBuilder[],
) {
  let currentPage = 0;

  const getButtons = () =>
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("prev")
        .setLabel("⬅️ Anterior")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPage === 0),
      new ButtonBuilder()
        .setCustomId("page")
        .setLabel(`📖 ${currentPage + 1} / ${embeds.length}`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId("next")
        .setLabel("Próxima ➡️")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPage === embeds.length - 1),
    );

  if (embeds.length <= 1) return;

  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 1000 * 60 * config.app.embedSessionDuration,
  });

  collector.on("collect", async (btnInt) => {
    if (btnInt.user.id !== interaction.user.id) {
      await btnInt.reply({
        content: "⚠️ Apenas quem executou o comando pode usar esses botões.",
        flags: ["Ephemeral"],
      });
      return;
    }

    if (btnInt.customId === "prev" && currentPage > 0) currentPage--;
    else if (btnInt.customId === "next" && currentPage < embeds.length - 1)
      currentPage++;

    await btnInt.update({
      embeds: [embeds[currentPage]],
      components: [getButtons()],
    });
  });

  collector.on("end", async () => {
    await interaction.editReply({
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("prev")
            .setLabel("⬅️ Anterior")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId("page")
            .setLabel(`📖 ${currentPage + 1} / ${embeds.length}`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId("next")
            .setLabel("Próxima ➡️")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
        ),
      ],
    });
  });
}
