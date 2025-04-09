"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: discord_js_1.Events.InteractionCreate,
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        if (!interaction.isChatInputCommand())
            return;
        if (interaction.options.getSubcommand(false)) {
            const subcommand = interaction.client.commands.get(interaction.commandName + ":" + interaction.options.getSubcommand());
            if (!subcommand)
                return;
            try {
                yield subcommand.execute(interaction);
            }
            catch (error) {
                console.error(error);
                yield interaction.reply({
                    content: "There was an error while executing this command!",
                    flags: discord_js_1.MessageFlags.Ephemeral,
                });
            }
            return;
        }
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command)
            return;
        try {
            yield command.execute(interaction);
        }
        catch (error) {
            console.error(error);
            yield interaction.reply({
                content: "There was an error while executing this command!",
                flags: discord_js_1.MessageFlags.Ephemeral,
            });
        }
    }),
};
