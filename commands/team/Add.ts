import { MessageFlags, SlashCommandSubcommandBuilder } from "discord.js";
import { SubcommandInterface } from "../../interfaces/SubcommandInterface";
import { getPassword } from "../../helpers";
import teams from "../../teams";

export default {
  name: "add",
  description: "Add a user to the team.",
  usage: "/team add <user> <role>",
  category: "team",
  execute: async (interaction) => {
    const member = interaction.options.getMember("user");
    const role = interaction.options.getString("role");
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

    try {
      await member.roles.add(process.env[role]!);
    } catch (error) {}

    await interaction.reply("User added to the team! " + role);
    const team = teams
      .find((team) => team.value === role)
      ?.name.replace("_", "%20");

    await fetch(
      `https://forums.therian-guide.com/dustycode/discordapi.php?auth=${getPassword()}
&operation=teamAdd&query=${member.nickname}&team=${team}`
    )
      .then((response) => response.json())
      .then((body) => console.log("body", body));
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
        .addChoices(teams)
    ),
} satisfies SubcommandInterface;
