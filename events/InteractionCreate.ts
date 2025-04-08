import { Events, MessageFlags } from "discord.js";
import { EventInterface } from "../interfaces/EventInterface";
import { ExtendedClient } from "../ExtendedClient";

export default {
  name: Events.InteractionCreate,
  execute: async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = (interaction.client as ExtendedClient).commands.get(
      interaction.commandName
    );
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
} satisfies EventInterface<Events.InteractionCreate>;
