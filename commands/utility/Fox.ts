import { SlashCommandBuilder } from "discord.js";
import { CommandInterface } from "../../interfaces/CommandInterface";

export default {
  name: "fox",
  description: "Get a random fox image.",
  usage: "/fox",
  category: "utility",
  execute: async (interaction) => {
    await interaction.deferReply();
    return fetch("https://randomfox.ca/floof/")
      .then((response) => response.json())
      .then(async (body) => {
        return interaction.editReply({
          content: body.image,
        });
      });
  },
  data: new SlashCommandBuilder()
    .setName("fox")
    .setDescription("Get a random fox image."),
} satisfies CommandInterface;
