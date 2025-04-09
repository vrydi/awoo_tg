"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const getFiles_1 = require("./getFiles");
const { REST } = require("discord.js");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const commands = [];
(0, getFiles_1.getFiles)("./commands").forEach((file) => {
    const command = require(file).default;
    if (command.path) {
        const subcommands = (0, getFiles_1.getFiles)("./commands" + command.path);
        const builder = command.data;
        subcommands.forEach((subcommand) => {
            const subcommandData = require(subcommand).default;
            if (subcommandData.path) {
                console.error(`Subcommand ${subcommand} does not have a path`);
                return;
            }
            if (!subcommandData.data) {
                console.error(`Subcommand ${subcommand} does not have data`);
                return;
            }
            builder.addSubcommand(subcommandData.data);
        });
        commands.push(builder.toJSON());
    }
    else if (command.data && command.data instanceof discord_js_1.SlashCommandBuilder) {
        if (!command.name) {
            console.error(`Command ${file} does not have a name`);
            return;
        }
        if (!command.execute) {
            console.error(`Command ${file} does not have an execute function`);
            return;
        }
        commands.push(command.data.toJSON());
    }
    console.log(`Deploying command: ${command.name}`);
});
console.log(`Deploying ${commands.length} commands...`);
const rest = new REST().setToken(process.env.DISCORD_TOKEN);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Started refreshing application (/) commands.");
        yield rest.put(discord_js_1.Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID), { body: commands });
        console.log("Successfully reloaded application (/) commands.");
    }
    catch (error) {
        console.error(error);
    }
}))();
