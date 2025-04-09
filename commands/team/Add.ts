import { MessageFlags, SlashCommandSubcommandBuilder } from "discord.js";
import { SubcommandInterface } from "../../interfaces/SubcommandInterface";

export default {
  name: "add",
  description: "Add a user to the team.",
  usage: "/team add <user> <role>",
  category: "team",
  execute: async (interaction) => {
    const member = interaction.options.getMember("user");
    const role = process.env[interaction.options.getString("role")!];
    if (!member) {
      return interaction.reply({
        content: "Please specify a user to add.",
        flags: MessageFlags.Ephemeral,
      });
    }
    if (!role) {
      return interaction.reply({
        content: "Please specify a valid role.",
        flags: MessageFlags.Ephemeral,
      });
    }

    member.roles.add(role);

    await interaction.reply("User added to the team!");
  },
  data: new SlashCommandSubcommandBuilder()
    .setName("add")
    .setDescription("Add a user to the team.")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to add").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("role")
        .setDescription("The role to assign to the user")
        .setRequired(true)
        .addChoices({ name: "Foxies Spirit Den", value: "foxies_spirit_den" })
    ),
} satisfies SubcommandInterface;
