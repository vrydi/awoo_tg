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
    name: "add",
    description: "Add a user to the team.",
    usage: "/team add <user> <role>",
    category: "team",
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const member = interaction.options.getMember("user");
        const role = process.env[interaction.options.getString("role")];
        if (!member) {
            return interaction.reply({
                content: "Please specify a user to add.",
                flags: discord_js_1.MessageFlags.Ephemeral,
            });
        }
        if (!role) {
            return interaction.reply({
                content: "Please specify a valid role.",
                flags: discord_js_1.MessageFlags.Ephemeral,
            });
        }
        member.roles.add(role);
        yield interaction.reply("User added to the team!");
    }),
    data: new discord_js_1.SlashCommandSubcommandBuilder()
        .setName("add")
        .setDescription("Add a user to the team.")
        .addUserOption((option) => option.setName("user").setDescription("The user to add").setRequired(true))
        .addStringOption((option) => option
        .setName("role")
        .setDescription("The role to assign to the user")
        .setRequired(true)
        .addChoices({ name: "Foxies Spirit Den", value: "foxies_spirit_den" })),
};
