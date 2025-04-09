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
    name: discord_js_1.Events.GuildMemberAdd,
    once: false,
    execute: (member) => __awaiter(void 0, void 0, void 0, function* () {
        yield member.roles.add(process.env.verified_role);
        member.client.channels.cache.get(process.env.introduction_channel).send({
            content: `Welcome to Therian Guide Discord ${member}! Please use the command "/join <tg username>" to get verified!`,
        });
    }),
};
