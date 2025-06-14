import { SlashCommandSubcommandBuilder } from "discord.js";
import { initDb } from "../../database";
import { CommandInterface } from "../../interfaces/CommandInterface";

export default {
  name: "yearly",
  description: "Check yearly activity of a user.",
  usage: "/activity yearly <user>",
  category: "admin",
  execute: async (interaction) => {
    const db = await initDb();
    const user = interaction.options.getUser("user")!;
    const currentYear = new Date().getFullYear();

    // get start of the year
    const startOfYear = `${currentYear}-01-01`;
    // get end of the year
    const endOfYear = `${currentYear}-12-31`;

    const userActivity = await db.get(
      "SELECT COUNT(*) AS total FROM user_activity WHERE username = ? AND date BETWEEN ? AND ? AND amount >= 2",
      [user.displayName, startOfYear, endOfYear]
    );

    if (!userActivity || userActivity.total === 0) {
      return interaction.reply({
        content: `No activity found for ${user.displayName} this year.`,
      });
    }

    return interaction.reply({
      content: `${user.displayName} has been active ${userActivity.total} days this year.`,
    });
  },
  data: new SlashCommandSubcommandBuilder()
    .setName("yearly")
    .setDescription("Check yearly activity of a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to check the activity of")
        .setRequired(true)
    ),
} as CommandInterface;
