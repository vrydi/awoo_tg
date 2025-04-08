import { MessageFlags, SlashCommandBuilder, TextChannel } from "discord.js";
import { CommandInterface } from "../../interfaces/CommandInterface";

export default {
  name: "shoutban",
  description: "Shoutban a user from the server.",
  usage: "/shoutban <user> <time>",
  category: "admin",
  execute: async (interaction) => {
    const member = interaction.options.getMember("user");
    const time = interaction.options.getNumber("time") || 7; // Default to 7 days if not provided
    const reason =
      interaction.options.getString("reason") || "No reason provided";

    if (!member) {
      return interaction.reply({
        content: "Please specify a user to shoutban.",
        flags: MessageFlags.Ephemeral,
      });
    }

    await interaction.reply({
      content: `Shoutbanning ${member.displayName} for ${time} days!`,
      flags: MessageFlags.Ephemeral,
    });

    // member.timeout(time * 24 * 60 * 60 * 1000, reason); // Convert days to milliseconds
    (
      interaction.client.channels.cache.get(
        process.env.staff_channel!
      ) as TextChannel
    ).send({
      content: `${member.displayName} has been shoutbanned for ${time} days. Reason: ${reason}`,
    });
  },
  data: new SlashCommandBuilder()
    .setName("shoutban")
    .setDescription("Shoutban a user from the server. Standard 1 week")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to shoutban")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("time")
        .setDescription("The time to shoutban the user for, in days")
        .setRequired(false)
        .setMinValue(7)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the shoutban")
        .setRequired(false)
    ),
} satisfies CommandInterface;
