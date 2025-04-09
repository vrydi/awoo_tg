import { Events, MessageFlags } from "discord.js";
import { EventInterface } from "../interfaces/EventInterface";
import { ExtendedClient } from "../ExtendedClient";

export default {
  name: Events.InteractionCreate,
  execute: async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.options.getSubcommand(false)) {
      const subcommand = (interaction.client as ExtendedClient).commands.get(
        interaction.commandName + ":" + interaction.options.getSubcommand()
      );

      if (!subcommand) return;

      try {
        await subcommand.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      }
      return;
    }

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
