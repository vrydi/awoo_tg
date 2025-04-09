import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";

export interface SubcommandInterface {
  name: string;
  description: string;
  usage?: string;
  category?: string;
  execute: (Interaction: ChatInputCommandInteraction<"cached">) => Promise<any>;
  data: SlashCommandSubcommandBuilder;
}
