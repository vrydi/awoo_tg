import { Guild, GuildMember, Message, TextChannel } from "discord.js";

const { Client, Events, GatewayIntentBits } = require("discord.js");

import * as dotenv from "dotenv";
import { ExtendedClient } from "./ExtendedClient";
import { getPassword } from "./helpers";
dotenv.config();

console.log("Starting bot...");

const client = new ExtendedClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.init();
client.login();
