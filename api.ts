import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ExtendedClient } from "./ExtendedClient";

let client = null as ExtendedClient | null;

export const clientInstance = (c: ExtendedClient) => {
  client = c;
};

const app = express();

app.listen(3000, () => {
  console.log("API listening on port 3000");
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/api/teams/:teamId", async (req, res) => {
  const teamId = req.params.teamId;
  console.log(`Received request for team ID: ${teamId}`);
  console.log(`Request body: ${JSON.stringify(req.body)}`);
  const { name, method } = req.body;

  console.log("client", client);

  if (!client) {
    res.status(500).send("Client not initialized");
    return;
  }

  if (!name || !method) {
    res.status(400).send("Missing name or method in request body");
    return;
  }

  console.log(`Name: ${name}`);
  console.log(`Method: ${method}`);

  if (method === "add") {
    const member = await client.guilds.cache
      .get(process.env.DISCORD_GUILD_ID!)
      ?.members.search({ query: name });
    if (!member) {
      res.status(404).send("Member not found");
      return;
    }
    const guildMember = member.first();

    if (!guildMember) {
      res.status(404).send("Guild member not found");
      return;
    }

    guildMember.roles.add(process.env[teamId]!);
  }

  if (method === "remove") {
    const member = await client.guilds.cache
      .get(process.env.DISCORD_GUILD_ID!)
      ?.members.search({ query: name });
    if (!member) {
      res.status(404).send("Member not found");
      return;
    }
    const guildMember = member.first();

    if (!guildMember) {
      res.status(404).send("Guild member not found");
      return;
    }

    guildMember.roles.remove(process.env[teamId]!);
  }

  res.status(200).send(`Team ID ${teamId} received`);
});

app.post("/api/shoutban/:username", async (req, res) => {
  const username = req.params.username;
  console.log(`Received request for username: ${username}`);
  console.log(`Request body: ${JSON.stringify(req.body)}`);

  const { reason, amount } = req.body;

  if (!client) {
    res.status(500).send("Client not initialized");
    return;
  }

  if (!reason) {
    res.status(400).send("Missing reason in request body");
    return;
  }

  console.log(`Reason: ${reason}`);
  console.log(`Amount: ${amount ? (amount < 7 ? 7 : amount) : 7}`);

  const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID!);

  if (!guild) {
    res.status(404).send("Guild not found");
    return;
  }

  const member = await guild.members.search({ query: username });
  if (!member) {
    res.status(404).send("Member not found");
    return;
  }

  const guildMember = member.first();

  if (!guildMember) {
    res.status(404).send("Guild member not found");
    return;
  }

  guildMember
    .timeout(
      1000 * 60 * 60 * 24 * (amount ? (amount < 7 ? 7 : amount) : 7),
      reason
    )
    .then(() => {
      res
        .status(200)
        .send(
          `User ${username} has been shoutbanned for ${
            amount ? (amount < 7 ? 7 : amount) : 7
          } days`
        );
    })
    .catch((error) => {
      console.error("Error shoutbanning user:", error);
      res.status(500).send("Error shoutbanning user");
    });
});

export function init() {
  console.log("API initialized");
  return app;
}
