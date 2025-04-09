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
const helpers_1 = require("../../helpers");
exports.default = {
    name: "join",
    description: "Join the server and get verified.",
    usage: "/join <tg username>",
    category: "general",
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const tgUsername = interaction.options.getString("tg_username");
        yield interaction.deferReply({ flags: discord_js_1.MessageFlags.Ephemeral });
        return fetch(`https://forums.therian-guide.com/dustycode/discordapi.php?auth=${(0, helpers_1.getPassword)()}&operation=testUsername&query=${tgUsername}`)
            .then((response) => response.json())
            .then((body) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("response", body.exists, body.users);
            if (!body.exists) {
                return interaction.reply({
                    content: `${tgUsername} does not exist on Therian Guide.`,
                    flags: discord_js_1.MessageFlags.Ephemeral,
                });
            }
            interaction.member.setNickname(tgUsername);
            yield interaction.member.roles.remove(process.env.verified_role);
            let role = process.env.pups_role;
            yield interaction.member.roles.add(role);
            interaction.editReply({
                content: `${interaction.member} has been given the '${interaction.guild.roles.cache.get(role).name}' role. Welcome to the server!`,
            });
        }));
    }),
    data: new discord_js_1.SlashCommandBuilder()
        .setName("join")
        .setDescription("Join the server and get verified.")
        .addStringOption((option) => option
        .setName("tg_username")
        .setDescription("Your Therian Guide username")
        .setRequired(true)),
};
