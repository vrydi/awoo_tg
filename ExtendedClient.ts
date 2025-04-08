import { Client, ClientOptions, Collection } from "discord.js";

export class ExtendedClient extends Client {
  commands: Collection<string, any> = new Collection();

  constructor(options: ClientOptions) {
    super(options);
  }
}
