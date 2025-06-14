import { Events, TextChannel } from "discord.js";
import { EventInterface } from "../interfaces/EventInterface";

export default {
  name: Events.GuildMemberAdd,
  once: false,
  execute: async (member) => {
    await member.roles.add(process.env.awaiting_activation!);
    (
      member.client.channels.cache.get(
        process.env.introduction_channel!
      ) as TextChannel
    ).send({
      content: `Welcome to Therian Guide Discord ${member}! Please use the command "/join <tg username>" to get verified!`,
    });
  },
} satisfies EventInterface<Events.GuildMemberAdd>;
