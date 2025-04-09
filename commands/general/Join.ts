import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { CommandInterface } from "../../interfaces/CommandInterface";
import { getPassword } from "../../helpers";

export default {
  name: "join",
  description: "Join the server and get verified.",
  usage: "/join <tg username>",
  category: "general",
  execute: async (interaction) => {
    const tgUsername = interaction.options.getString("tg_username");
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    return fetch(
      `https://forums.therian-guide.com/dustycode/discordapi.php?auth=${getPassword()}&operation=testUsername&query=${tgUsername}`
    )
      .then((response) => response.json())
      .then(async (body) => {
        console.log("response", body.exists, body.users);
        if (!body.exists) {
          return interaction.reply({
            content: `${tgUsername} does not exist on Therian Guide.`,
            flags: MessageFlags.Ephemeral,
          });
        }

        interaction.member!.setNickname(tgUsername!);
        await interaction.member!.roles.remove(process.env.verified_role!);
        let role = process.env.pups_role!;
        await interaction.member!.roles.add(role);
        interaction.editReply({
          content: `${interaction.member} has been given the '${
            interaction.guild.roles.cache.get(role)!.name
          }' role. Welcome to the server!`,
        });
      });
  },
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Join the server and get verified.")
    .addStringOption((option) =>
      option
        .setName("tg_username")
        .setDescription("Your Therian Guide username")
        .setRequired(true)
    ),
} satisfies CommandInterface;
