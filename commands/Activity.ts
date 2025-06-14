import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default {
  path: "/activity",
  data: new SlashCommandBuilder()
    .setName("activity")
    .setDescription("Check users activity.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
};
