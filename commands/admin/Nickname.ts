import {
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { CommandInterface } from "../../interfaces/CommandInterface";

export default {
  name: "nickname",
  description: "Change the nickname of a user.",
  usage: "/nickname <user> <nickname>",
  category: "admin",
  execute: async (interaction) => {
    const member = interaction.options.getMember("user");
    const nickname = interaction.options.getString("nickname");

    if (!member) {
      return interaction.reply({
        content: "Please specify a user to change the nickname.",
        flags: MessageFlags.Ephemeral,
      });
    }
    if (!nickname) {
      return interaction.reply({
        content: "Please specify a new nickname.",
        flags: MessageFlags.Ephemeral,
      });
    }

    await member.setNickname(nickname, "Nickname changed by bot");
    await interaction.reply({
      content: `Nickname changed to ${nickname} for ${member.displayName}`,
      flags: MessageFlags.Ephemeral,
    });
  },
  data: new SlashCommandBuilder()
    .setName("nickname")
    .setDescription("Change the nickname of a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to change the nickname")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("nickname")
        .setDescription("The new nickname")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
} satisfies CommandInterface;
