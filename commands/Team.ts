import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default {
  path: "/team",
  data: new SlashCommandBuilder()
    .setName("team")
    .setDescription("Manage your team.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
};
