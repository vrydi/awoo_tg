import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { CommandInterface } from "../../interfaces/CommandInterface";
import { getPassword } from "../../helpers";

interface user {
  username: string;
  title: string;
}

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

        const userTitle = (body.users as [[user]])
          .flat()[0]
          .title.toLowerCase();
        console.log("userTitle", userTitle);
        try {
          await interaction.member!.roles.add(process.env[userTitle]!);
        } catch (error) {
          console.error(`team ${userTitle} doesn't exist`, error);
          await interaction.member!.roles.add(process.env["greymuzzle"]!);
        }

        fetch(
          `https://forums.therian-guide.com/dustycode/discordapi.php?auth=${getPassword()}&operation=getTeams&query=${tgUsername}`
        )
          .then((response) => response.json())
          .then(async (teamsBody) => {
            console.log(teamsBody);

            if (teamsBody.teams) {
              const teams = teamsBody.teams.map((team: string) =>
                team
                  .toLowerCase()
                  .replace(/\s+/g, "_")
                  .replace(/\'/g, "")
                  .replace(/-/g, "_")
              ) as string[];
              teams.forEach(async (team) => {
                console.log(team);

                try {
                  await interaction.member!.roles.add(process.env[team]!);
                } catch (error) {
                  // console.error(`team ${team} doesn't exist`, error);
                }
              });
            }
            interaction.member!.setNickname(tgUsername!);
            await interaction.member!.roles.remove(process.env.verified_role!);

            interaction.editReply({
              content: `${interaction.member}. Welcome to the server!`,
            });
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
