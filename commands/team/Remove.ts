import { MessageFlags, SlashCommandSubcommandBuilder } from "discord.js";
import { SubcommandInterface } from "../../interfaces/SubcommandInterface";
import teams from "../../teams";
import { getPassword } from "../../helpers";

export default {
  name: "remove",
  description: "Remove a user from your team.",
  usage: "/team remove <user>",
  category: "team",
  execute: async (interaction) => {
    const member = interaction.options.getMember("user");
    const role = interaction.options.getString("role");
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

    try {
      await member.roles.remove(process.env[role]!);
    } catch (error) {
      console.error("role doesn't exist on member", role);
    }

    await interaction.reply("User removed from team! " + role);

    const team = teams
      .find((team) => team.value === role)
      ?.name.replace("_", "%20");
    await fetch(
      `https://forums.therian-guide.com/dustycode/discordapi.php?auth=${getPassword()}
&operation=teamRemove&query=${member.nickname}&team=${team}`
    )
      .then((response) => response.json())
      .then((body) => console.log("body", body));
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
        .addChoices(teams)
    ),
} satisfies SubcommandInterface;
