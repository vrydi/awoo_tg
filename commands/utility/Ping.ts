import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandInterface } from "../../interfaces/CommandInterface";

export default {
  name: "ping",
  description: "Ping the bot to check if it's alive.",
  usage: "/woof",
  category: "utility",
  execute: async (interaction) => {
    await interaction.reply("Bark!");
  },
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping the bot to check if it's alive.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
} satisfies CommandInterface;
