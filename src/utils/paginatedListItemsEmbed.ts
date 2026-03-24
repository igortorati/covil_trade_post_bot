import {
  EmbedBuilder,
} from "discord.js";
import AvailableItem from "../models/availableItem.model";

export function createPaginatedEmbeds(
  availableItems: AvailableItem[],
  seasonName: string,
): EmbedBuilder[] {
  const embeds: EmbedBuilder[] = [];

  const makeField = (ai: any) => {
    const item = ai.item!;
    const rarity = item.rarity!;
    return {
      name: `🆔 ID: ${ai.id}`,
      value: [
        `**🧪 ${item.name}** — *${rarity.namePt}*`,
        `**💰 Preço:** ${ai.price} PO`,
        `**📦 Quantidade:** ${ai.quantity}`,
        `**🔁 Troca:** ${ai.canTrade ? "Sim" : "Não"}`,
        `\u200B`
      ].join("\n"),
      inline: false,
    };
  };

  const fields = availableItems.map(makeField);

  let pageFields: any[] = [];
  let charCount = 0;

  for (const field of fields) {
    const fieldLength = field.name.length + field.value.length;

    if (pageFields.length >= 5 || charCount + fieldLength >= 5900) {
      embeds.push(
        new EmbedBuilder()
          .setTitle(`📦 Itens – ${seasonName}`)
          .setColor("Blurple")
          .setFooter({ text: `Página ${embeds.length + 1}` })
          .addFields(pageFields),
      );
      pageFields = [];
      charCount = 0;
    }

    pageFields.push(field);
    charCount += fieldLength;
  }

  if (pageFields.length > 0) {
    embeds.push(
      new EmbedBuilder()
        .setTitle(`📦 Itens – ${seasonName}`)
        .setColor("Blurple")
        .setFooter({ text: `Página ${embeds.length + 1}` })
        .addFields(pageFields),
    );
  }

  return embeds;
}