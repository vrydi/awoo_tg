import { Events } from "discord.js";
import { EventInterface } from "../interfaces/EventInterface";
import * as fs from "fs";
import * as path from "path";
import { initDb } from "../database";

export default {
  name: Events.MessageCreate,
  once: false,
  execute: async (message) => {
    if (message.author.id === message.client.user.id) return; // Ignore messages from the bot itself
    const match = message.content.match(
      /New therianthropy post\s*-\s*.+?\s+(#\d+)\s+https:\/\/\S+/
    );
    if (message.channelId === process.env.therianthropy_channel && match) {
      if (message.content.startsWith("New therianthropy post - ")) {
        let cutMessage = message.content.replace(
          "New therianthropy post - ",
          ""
        );
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
    }

    const username = message.author.displayName; // Use nickname if available, otherwise username
    if (message.author.bot) return; // Ignore messages from bots
    // edit a local sql database
    const db = await initDb();
    const dbRecord = await db.get(
      "SELECT * FROM user_activity WHERE user_activity.username = ? AND user_activity.date = ?",
      [username, new Date().toISOString().slice(0, 10)] // YYYY-MM-DD format
    );
    console.log("dbRecord", dbRecord);
    if (dbRecord) {
      // If a record exists, update the amount
      await db.run(
        "UPDATE user_activity SET amount = amount + 1 WHERE username = ? AND date = ?",
        [username, new Date().toISOString().slice(0, 10)]
      );
    } else {
      // If no record exists, insert a new one
      const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const amount = 1;

      await db.run(
        "INSERT INTO user_activity (username, date, amount) VALUES (?, ?, ?)",
        [username, date, amount]
      );
    }
    await db.close(); // Close the database connection after the operation
  },
} satisfies EventInterface<Events.MessageCreate>;
