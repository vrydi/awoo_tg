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
    name: "shoutban",
    description: "Shoutban a user from the server.",
    usage: "/shoutban <user> <time>",
    category: "admin",
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const member = interaction.options.getMember("user");
        const time = interaction.options.getNumber("time") || 7; // Default to 7 days if not provided
        const reason = interaction.options.getString("reason") || "No reason provided";
        if (!member) {
            return interaction.reply({
                content: "Please specify a user to shoutban.",
                flags: discord_js_1.MessageFlags.Ephemeral,
            });
        }
        yield interaction.reply({
            content: `Shoutbanning ${member.displayName} for ${time} days!`,
            flags: discord_js_1.MessageFlags.Ephemeral,
        });
        // member.timeout(time * 24 * 60 * 60 * 1000, reason); // Convert days to milliseconds
        interaction.client.channels.cache.get(process.env.staff_channel).send({
            content: `${member.displayName} has been shoutbanned for ${time} days. Reason: ${reason}`,
        });
    }),
    data: new discord_js_1.SlashCommandBuilder()
        .setName("shoutban")
        .setDescription("Shoutban a user from the server. Standard 1 week")
        .addUserOption((option) => option
        .setName("user")
        .setDescription("The user to shoutban")
        .setRequired(true))
        .addNumberOption((option) => option
        .setName("time")
        .setDescription("The time to shoutban the user for, in days")
        .setRequired(false)
        .setMinValue(7))
        .addStringOption((option) => option
        .setName("reason")
        .setDescription("The reason for the shoutban")
        .setRequired(false)),
};
