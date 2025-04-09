"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    path: "/team",
    data: new discord_js_1.SlashCommandBuilder()
        .setName("team")
        .setDescription("Manage your team."),
};
