import { EmbedBuilder, Events, Message, TextChannel } from "discord.js";
import { EventInterface } from "../interfaces/EventInterface";

export default {
  name: Events.MessageDelete,
  once: false,
  execute: async (message) => {
    if (message.author?.id === message.client.user.id) return; // Ignore messages from the bot itself

    const embed = new EmbedBuilder()
      .setTitle("Message Deleted")
      .setTimestamp(message.createdAt)
      .setColor("Red")
      .addFields([
        {
          name: "Message",
          value: message.content || "No content (image or embed)",
        },
        {
          name: "Author",
          value: message.author?.toString() || "Unknown",
        },
        {
          name: "Channel",
          value: message.channel.url,
        },
      ])
      .setFooter({
        text: `ID: ${message.id}`,
        iconURL: message.author?.displayAvatarURL(),
      });

    (message.client.channels.cache.get(
      process.env.debug_channel!
    ) as TextChannel)!.send({
      embeds: [embed],
    });
  },
} satisfies EventInterface<Events.MessageDelete>;
