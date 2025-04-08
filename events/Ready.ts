import { Events } from "discord.js";
import { EventInterface } from "../interfaces/EventInterface";

export default {
  name: Events.ClientReady,
  once: true,
  execute: async (client) => {
    console.log(`Logged in as ${client.user.tag}`);
    console.debug(
      // @ts-ignore
      `commands: ${client.commands.map((command) => command.name)}`
    );
  },
} satisfies EventInterface<Events.ClientReady>;
