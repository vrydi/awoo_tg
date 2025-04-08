import { Routes } from "discord.js";
import { getFiles } from "./getFiles";
import { CommandInterface } from "./interfaces/CommandInterface";
const { REST } = require("discord.js");

import * as dotenv from "dotenv";
dotenv.config();

const commands: string[] = [];

getFiles("./commands").forEach((file) => {
  const command = require(file).default as CommandInterface;
  if (!command.name) {
    console.error(`Command ${file} does not have a name`);
    return;
  }
  if (!command.execute) {
    console.error(`Command ${file} does not have an execute function`);
    return;
  }
  console.log(`Deploying command: ${command.name}`);

  const data = command.data.toJSON();
  commands.push(data);
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
