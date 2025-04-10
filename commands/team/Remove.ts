import { MessageFlags, SlashCommandSubcommandBuilder } from "discord.js";
import { SubcommandInterface } from "../../interfaces/SubcommandInterface";

export default {
  name: "remove",
  description: "Remove a user from your team.",
  usage: "/team remove <user>",
  category: "team",
  execute: async (interaction) => {
    const member = interaction.options.getMember("user");
    const role = process.env[interaction.options.getString("role")!];
    if (!member) {
      return interaction.reply({
        content: "Please specify a user to remove.",
        flags: MessageFlags.Ephemeral,
      });
    }
    if (!role) {
      return interaction.reply({
        content: "Please specify a valid role.",
        flags: MessageFlags.Ephemeral,
      });
    }

    member.roles.remove(role);

    await interaction.reply("User removed from team!");
  },
  data: new SlashCommandSubcommandBuilder()
    .setName("remove")
    .setDescription("Remove a user from your team.")
    .addUserOption((option) =>
      option.setName("user").setDescription("User to remove").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("role")
        .setDescription("Role to remove from the user")
        .setRequired(true)
        .addChoices({ name: "Foxies Spirit Den", value: "foxies_spirit_den" })
    ),
} satisfies SubcommandInterface;
