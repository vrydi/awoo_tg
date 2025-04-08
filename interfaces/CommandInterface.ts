import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export interface CommandInterface {
  name: string;
  description: string;
  usage?: string;
  category?: string;
  execute: (Interaction: ChatInputCommandInteraction<"cached">) => Promise<any>;
  data: Pick<SlashCommandBuilder, any>;
}
