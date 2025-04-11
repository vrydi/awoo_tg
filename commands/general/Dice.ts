import { SlashCommandBuilder } from "discord.js";
import { CommandInterface } from "../../interfaces/CommandInterface";

export default {
  name: "dice",
  description: "Roll a dice.",
  usage: "/dice <number of sides>",
  category: "general",
  execute: async (interaction) => {
    const sides = interaction.options.getInteger("sides") || 6;
    const result = Math.floor(Math.random() * sides) + 1;
    return interaction.reply(`You rolled a ${result}!`);
  },
  data: new SlashCommandBuilder()
    .setName("dice")
    .setDescription("Roll a dice.")
    .addIntegerOption((option) =>
      option
        .setName("sides")
        .setDescription("Number of sides on the dice")
        .setRequired(false)
        .setMinValue(2)
        .setMaxValue(1000)
    ),
} satisfies CommandInterface;
