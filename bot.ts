import { Guild, GuildMember, Message, TextChannel } from "discord.js";

const { Client, Events, GatewayIntentBits } = require("discord.js");

import * as dotenv from "dotenv";
import { ExtendedClient } from "./ExtendedClient";
import * as api from "./api";

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

api.init(); // Initialize the API with the client instance
api.clientInstance(client); // Pass the client instance to the API
