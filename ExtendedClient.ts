import { Client, ClientOptions, Collection } from "discord.js";
import { getFiles } from "./getFiles";

export class ExtendedClient extends Client {
  commands: Collection<string, any> = new Collection();

  constructor(options: ClientOptions) {
    super(options);
  }

  init() {
    this.registerEvents();
    this.registerCommands();
  }

  registerEvents() {
    const eventFiles = require("fs")
      .readdirSync("./events")
      .filter((file: string) => file.endsWith(".js"));

    for (const file of eventFiles) {
      const event = require(`./events/${file}`).default;
      if (!event.name) {
        console.error(`Event ${file} does not have a name`);
        continue;
      }
      if (!event.execute) {
        console.error(`Event ${file} does not have an execute function`);
        continue;
      }
      if (event.once) {
        this.once(event.name, (...args: any[]) => event.execute(...args));
      } else {
        this.on(event.name, (...args: any[]) => event.execute(...args));
      }
    }
  }

  registerCommands() {
    const commandFiles = getFiles("./commands");

    for (const file of commandFiles) {
      const command = require(file).default;
      if (!command.name) {
        console.error(`Command ${file} does not have a name`);
        continue;
      }
      if (!command.execute) {
        console.error(`Command ${file} does not have an execute function`);
        continue;
      }
      this.commands.set(command.name, command);
    }
  }
}
