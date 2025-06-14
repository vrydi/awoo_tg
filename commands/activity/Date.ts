import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { initDb } from "../../database";
import { CommandInterface } from "../../interfaces/CommandInterface";

export default {
  name: "date",
  description: "Check the activity of a user on a specified date.",
  usage: "/activity date <user> <date>",
  category: "admin",
  execute: async (interaction) => {
    const db = await initDb();
    const user = interaction.options.getUser("user")!;
    const date = interaction.options.getString("date")!;

    // check if valid date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return interaction.reply({
        content: "Please provide a valid date in the format YYYY-MM-DD.",
      });
    }

    // check if date is in the past
    const today = new Date();
    const inputDate = new Date(date);
    if (inputDate > today) {
      return interaction.reply({
        content: "You cannot check activity for a future date.",
      });
    }

    const userActivity = await db.get(
      "SELECT amount FROM user_activity WHERE username = ? AND date = ?",
      [user.displayName, date]
    );

    if (!userActivity) {
      return interaction.reply({
        content: `No activity found for ${user.displayName} on ${date}.`,
      });
    }

    return interaction.reply({
      content: `${user.displayName} has been active ${userActivity.amount} times on ${date}.`,
    });
  },
  data: new SlashCommandSubcommandBuilder()
    .setName("date")
    .setDescription("Check the activity of a user on a specified date.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to check the activity of")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription("The date to check the activity on (YYYY-MM-DD)")
        .setRequired(true)
    ),
} as CommandInterface;
