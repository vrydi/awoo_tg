import { EmbedBuilder, Events, TextChannel } from "discord.js";
import { EventInterface } from "../interfaces/EventInterface";

export default {
  name: Events.MessageUpdate,
  once: false,
  execute: async (oldMessage, newMessage) => {
    if (oldMessage.author?.id === oldMessage.client.user.id) return; // Ignore messages from the bot itself
    if (oldMessage.content === newMessage.content) return; // Ignore messages that haven't changed

    const embed = new EmbedBuilder()
      .setTitle("Message Edited")
      .setTimestamp(oldMessage.createdAt)
      .setColor("Yellow")
      .addFields([
        {
          name: "Old Message",
          value: oldMessage.content || "No content (image or embed)",
        },
        {
          name: "New Message",
          value: newMessage.content || "No content (image or embed)",
        },
        {
          name: "Author",
          value: oldMessage.author?.toString() || "Unknown",
        },
        {
          name: "Channel",
          value: oldMessage.url,
        },
      ])
      .setFooter({
        text: `ID: ${oldMessage.id}`,
        iconURL: oldMessage.author?.displayAvatarURL(),
      });

    (oldMessage.client.channels.cache.get(
      process.env.debug_channel!
    ) as TextChannel)!.send({
      embeds: [embed],
    });
  },
} satisfies EventInterface<Events.MessageUpdate>;
