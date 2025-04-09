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

client.on(Events.MessageCreate, async (message: Message) => {
  // staff commands

  if (message.content.startsWith("!team")) {
    if (!(message.member && (await checkIfStaff(message.member)))) {
      return;
    }

    const args = message.content.split(" ");
    const roleName = args[3];
    const func = args[1];
    const member = message.mentions.members?.first();

    if (!member) {
      message.reply("Please mention a valid member of this server");
      return;
    }

    const role = message.guild?.roles.cache.find(
      (role) => role.name === roleName
    );

    if (!role) {
      message.reply(`Role '${roleName}' not found`);
      return;
    }

    // give a role to a member by being tagged by specific members (usernames) in the guild. if the member is not in the guild, then reply with non existent user error.
    if (func === "add") {
      if (member.roles.cache.has(role.id)) {
        message.reply(`${member.user.tag} already has the role ${roleName}`);
        return;
      }

      try {
        member.roles.add(role);
        message.reply(
          `${member.user.tag} has been given the '${roleName}' role`
        );
      } catch (err) {
        message.reply(`Failed to assign role to ${member.user.tag}`);
        console.error(err);
      }
    }
    if (func === "remove") {
      if (!member.roles.cache.has(role.id)) {
        message.reply(`${member.user.tag} does not have the role ${roleName}`);
        return;
      }

      try {
        member.roles.remove(role);
        message.reply(
          `${member.user.tag} has been removed from the '${roleName}' role`
        );
      } catch (err) {
        message.reply(`Failed to remove role from ${member.user.tag}`);
        console.error(err);
      }
    }
  }

  if (message.content.startsWith("!nickname")) {
    if (!(message.member && (await checkIfStaff(message.member)))) {
      return;
    }
    const args = message.content.split(" ");
    const member = message.mentions.members?.first();
    args.shift();
    args.shift();
    const nickname = args.join(" ");

    if (!member) {
      message.reply("Please mention a valid member of this server");
      return;
    }

    if (!nickname) {
      message.reply("Please provide a nickname");
      return;
    }

    try {
      member.setNickname(nickname);
      message.reply(
        `${member.user.tag} has been given the nickname ${nickname}`
      );
    } catch (err) {
      message.reply(`Failed to assign nickname to ${member.user.tag}`);
      console.error(err);
    }
  }
});

client.on(Events.GuildMemberAdd, (member: GuildMember) => {
  console.info("New member joined", member.user.tag);
  return;
  const role = member.guild.roles.cache.find(
    (role) => role.name === "awaiting activation"
  );
  console.log(role);
  if (!role) {
    console.error("Role 'awaiting activation' not found");
    return;
  }
  member.roles.add(role!);

  console.log("Sending welcome message to", member.user.tag);

  (
    client.channels.cache.get(process.env.introduction_channel!) as TextChannel
  ).send("Welcome! Please reply with '!join' to get activated.");

  client.on(Events.MessageCreate, async (message: Message) => {
    if (
      message.author.id === member.id &&
      message.content.startsWith("!join")
    ) {
      const args = message.content.split(" ");
      args.shift();
      const nickname = args.join(" ");

      try {
        const newRole = member.guild.roles.cache.find(
          (role) => role.name === "awaiting activation"
        );

        if (!newRole) {
          console.error("Role 'awaiting activation' not found");
          return;
        }

        await member.roles.add(newRole);
        if (!nickname) {
          message.reply("Please provide a nickname");
          return;
        }

        try {
          doesUserExist(nickname).then((exists) => {
            if (exists) {
              message.reply(`${nickname} exists on therianguide`);
              member.roles.remove(newRole);
              const role = member.guild.roles.cache.find(
                (role) => role.name === "newcomer"
              );
              if (!role) {
                message.reply(
                  "Failed to assign role. Please contact an admin."
                );
                console.error("Role 'newcomer' not found");
                return;
              }

              member.setNickname(nickname);
              member.roles.add(role);
              message.reply(
                `${member.user.tag} has been given the 'newcomer' role. Welconme to the server!`
              );
            } else {
              message.reply(`${nickname} does not exist on therianguide`);
            }
          });
        } catch (err) {}
      } catch (err) {
        message.reply("Failed to assign role. Please contact an admin.");
        console.error(err);
      }
    } else if (message.author.id === member.id) {
      message.reply(
        "Invalid command. Please reply with '!join [therianguide username]' to get activated."
      );
    }
  });
});

async function doesUserExist(username: string): Promise<boolean> {
  return fetch(
    `https://forums.therian-guide.com/dustycode/discordapi.php?auth=${getPassword()}&operation=testUsername&query=${username}`
  )
    .then((response) => response.json())
    .then((body) => {
      console.log("response", body);
      return body.exists;
    });
}

async function checkIfStaff(member: GuildMember): Promise<boolean> {
  const staffMembers = await fetch(
    `https://forums.therian-guide.com/dustycode/discordapi.php?auth=${getPassword()}&operation=getStaff`
  )
    .then((response) => response.json())
    .then((body) => body.users.map((user: any) => user.username) as string[]);
  console.log(staffMembers);

  const nickname = member.displayName;
  console.log(nickname);
  return staffMembers.includes(nickname);
}
