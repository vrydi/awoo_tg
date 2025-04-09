import { Routes, SlashCommandBuilder } from "discord.js";
import { getFiles } from "./getFiles";
import { CommandInterface } from "./interfaces/CommandInterface";
const { REST } = require("discord.js");

import * as dotenv from "dotenv";
dotenv.config();

const commands: string[] = [];

getFiles("./commands").forEach((file) => {
  const command = require(file).default;
  if (command.path) {
    const subcommands = getFiles("./commands" + command.path);
    const builder = command.data;
    subcommands.forEach((subcommand) => {
      const subcommandData = require(subcommand).default;
      if (subcommandData.path) {
        console.error(`Subcommand ${subcommand} does not have a path`);
        return;
      }
      if (!subcommandData.data) {
        console.error(`Subcommand ${subcommand} does not have data`);
        return;
      }
      builder.addSubcommand(subcommandData.data);
    });
    commands.push(builder.toJSON());
  } else if (command.data && command.data instanceof SlashCommandBuilder) {
    if (!command.name) {
      console.error(`Command ${file} does not have a name`);
      return;
    }
    if (!command.execute) {
      console.error(`Command ${file} does not have an execute function`);
      return;
    }
    commands.push(command.data.toJSON());
  }

  console.log(`Deploying command: ${command.name}`);
});

console.log(`Deploying ${commands.length} commands...`);

const rest = new REST().setToken(process.env.DISCORD_TOKEN);
(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID!,
        process.env.DISCORD_GUILD_ID!
      ),
      { body: commands }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
