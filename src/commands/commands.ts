import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  StringSelectMenuInteraction,
} from "discord.js";
import { RateLimiter } from "discord.js-rate-limiter";

export interface Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  cooldown?: RateLimiter;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
  modalSubmit?(interaction: ModalSubmitInteraction): Promise<void>;
  selectMenu?(interaction: StringSelectMenuInteraction): Promise<void>;
}