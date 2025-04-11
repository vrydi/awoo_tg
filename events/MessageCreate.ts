import { Events } from "discord.js";
import { EventInterface } from "../interfaces/EventInterface";
import * as fs from "fs";
import * as path from "path";

export default {
  name: Events.MessageCreate,
  once: false,
  execute: async (message) => {
    if (message.author.id === message.client.user.id) return; // Ignore messages from the bot itself
    if (message.channelId !== process.env.therianthropy_channel) return; // Ignore messages not in the therianthropy channel
    const match = message.content.match(
      /New therianthropy post\s*-\s*.+?\s+(#\d+)\s+https:\/\/\S+/
    );

    if (message.content.startsWith("New therianthropy post - ")) {
      let cutMessage = message.content.replace("New therianthropy post - ", "");
      cutMessage = cutMessage.split("https://")[0];
      cutMessage = cutMessage.split("#")[0];

      console.log("cutMessage", cutMessage, match ? match[1] : "no match");

      if (!cutMessage.includes("shift")) return;

      const url =
        "htttps://" + message.content.split("https://")[1].split("?")[0];

      console.log(url);

      const file = fs.readFileSync("../therianthropy.txt", "utf8");

      if (file.includes(url)) return;

      fs.appendFileSync("../therianthropy.txt", `${url}\n`);
      console.log("The file was saved!");

      message.reply({
        content: `${cutMessage.replace("shift", "shit")}`,
      });
      message.react("💩").catch(console.error);
    }
  },
} satisfies EventInterface<Events.MessageCreate>;
