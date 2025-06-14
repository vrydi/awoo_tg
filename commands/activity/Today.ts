import {
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { CommandInterface } from "../../interfaces/CommandInterface";
import { initDb } from "../../database";

export default {
  name: "today",
  description: "Check todays activity of a user.",
  usage: "/activity today <user>",
  category: "admin",
  execute: async (interaction) => {
    console.log("Executing /activity today command");
    const db = await initDb();
    const userActivity = await db.get(
      "SELECT amount FROM user_activity WHERE username = ? AND date = ?",
      [
        interaction.options.getUser("user")!.displayName,
        new Date().toISOString().slice(0, 10),
      ]
    ); // YYYY-MM-DD format
    if (!userActivity) {
      return interaction.reply({
        content: `No activity found for ${
          interaction.options.getUser("user")!.displayName
        } today.`,
      });
    }
    return interaction.reply({
      content: `${
        interaction.options.getUser("user")!.displayName
      } has been active ${userActivity.amount} times today.`,
    });
  },
  data: new SlashCommandSubcommandBuilder()
    .setName("today")
    .setDescription("Check todays activity of a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to check the activity of")
        .setRequired(true)
    ),
} satisfies CommandInterface;
