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
const { Client, Events, GatewayIntentBits } = require("discord.js");
const dotenv = __importStar(require("dotenv"));
const ExtendedClient_1 = require("./ExtendedClient");
dotenv.config();
console.log("Starting bot...");
const client = new ExtendedClient_1.ExtendedClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});
client.init();
client.login();
client.on(Events.MessageCreate, (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    // staff commands
    if (message.content.startsWith("!shoutban")) {
        if (!(message.member && (yield checkIfStaff(message.member)))) {
            return;
        }
        const member = (_a = message.mentions.members) === null || _a === void 0 ? void 0 : _a.first();
        if (!member) {
            message.reply("Please mention a valid member of this server");
            return;
        }
        // member.timeout(1000 * 60 * 60 * 24 * 7, 'shoutbanned').then(() => {
        member
            .timeout(1000 * 60, "shoutbanned")
            .then(() => {
            message.reply(`${member.user.tag} has been shoutbanned for a week`);
        })
            .catch((err) => {
            message.reply(`Failed to shoutban ${member.user.tag}`);
            console.error(err);
        });
    }
    if (message.content.startsWith("!team")) {
        if (!(message.member && (yield checkIfStaff(message.member)))) {
            return;
        }
        const args = message.content.split(" ");
        const roleName = args[3];
        const func = args[1];
        const member = (_b = message.mentions.members) === null || _b === void 0 ? void 0 : _b.first();
        if (!member) {
            message.reply("Please mention a valid member of this server");
            return;
        }
        const role = (_c = message.guild) === null || _c === void 0 ? void 0 : _c.roles.cache.find((role) => role.name === roleName);
        if (!role) {
            message.reply(`Role '${roleName}' not found`);
            return;
        }
        // give a role to a member by being tagged by specific members (usernames) in the guild. if the member is not in the guild, then reply with non existent user error.
        if (func === "add") {
            if (member.roles.cache.has(role.id)) {
                message.reply(`${member.user.tag} already has the role ${roleName}`);
                return;
            }
            try {
                member.roles.add(role);
                message.reply(`${member.user.tag} has been given the '${roleName}' role`);
            }
            catch (err) {
                message.reply(`Failed to assign role to ${member.user.tag}`);
                console.error(err);
            }
        }
        if (func === "remove") {
            if (!member.roles.cache.has(role.id)) {
                message.reply(`${member.user.tag} does not have the role ${roleName}`);
                return;
            }
            try {
                member.roles.remove(role);
                message.reply(`${member.user.tag} has been removed from the '${roleName}' role`);
            }
            catch (err) {
                message.reply(`Failed to remove role from ${member.user.tag}`);
                console.error(err);
            }
        }
    }
    if (message.content.startsWith("!nickname")) {
        if (!(message.member && (yield checkIfStaff(message.member)))) {
            return;
        }
        const args = message.content.split(" ");
        const member = (_d = message.mentions.members) === null || _d === void 0 ? void 0 : _d.first();
        args.shift();
        args.shift();
        const nickname = args.join(" ");
        if (!member) {
            message.reply("Please mention a valid member of this server");
            return;
        }
        if (!nickname) {
            message.reply("Please provide a nickname");
            return;
        }
        try {
            member.setNickname(nickname);
            message.reply(`${member.user.tag} has been given the nickname ${nickname}`);
        }
        catch (err) {
            message.reply(`Failed to assign nickname to ${member.user.tag}`);
            console.error(err);
        }
    }
    if (message.content.startsWith("!exists")) {
        if (message.channel.id !== process.env.staff_channel) {
            return;
        }
        const args = message.content.split(" ");
        const username = args[1];
        if (!username) {
            message.reply("Please provide a username");
            return;
        }
        // check if a user exists in the api
        // if not, then reply with non existent user error
        // if exists, then reply with user exists
        doesUserExist(username).then((exists) => {
            if (exists) {
                message.reply(`${username} exists in the database`);
            }
            else {
                message.reply(`${username} does not exist in the database`);
            }
        });
    }
}));
client.on(Events.GuildMemberAdd, (member) => {
    console.info("New member joined", member.user.tag);
    const role = member.guild.roles.cache.find((role) => role.name === "awaiting activation");
    console.log(role);
    if (!role) {
        console.error("Role 'awaiting activation' not found");
        return;
    }
    member.roles.add(role);
    console.log("Sending welcome message to", member.user.tag);
    client.channels.cache.get(process.env.introduction_channel).send("Welcome! Please reply with '!join' to get activated.");
    client.on(Events.MessageCreate, (message) => __awaiter(void 0, void 0, void 0, function* () {
        if (message.author.id === member.id &&
            message.content.startsWith("!join")) {
            const args = message.content.split(" ");
            args.shift();
            const nickname = args.join(" ");
            try {
                const newRole = member.guild.roles.cache.find((role) => role.name === "awaiting activation");
                if (!newRole) {
                    console.error("Role 'awaiting activation' not found");
                    return;
                }
                yield member.roles.add(newRole);
                if (!nickname) {
                    message.reply("Please provide a nickname");
                    return;
                }
                try {
                    doesUserExist(nickname).then((exists) => {
                        if (exists) {
                            message.reply(`${nickname} exists on therianguide`);
                            member.roles.remove(newRole);
                            const role = member.guild.roles.cache.find((role) => role.name === "newcomer");
                            if (!role) {
                                message.reply("Failed to assign role. Please contact an admin.");
                                console.error("Role 'newcomer' not found");
                                return;
                            }
                            member.setNickname(nickname);
                            member.roles.add(role);
                            message.reply(`${member.user.tag} has been given the 'newcomer' role. Welconme to the server!`);
                        }
                        else {
                            message.reply(`${nickname} does not exist on therianguide`);
                        }
                    });
                }
                catch (err) { }
            }
            catch (err) {
                message.reply("Failed to assign role. Please contact an admin.");
                console.error(err);
            }
        }
        else if (message.author.id === member.id) {
            message.reply("Invalid command. Please reply with '!join [therianguide username]' to get activated.");
        }
    }));
});
function doesUserExist(username) {
    return __awaiter(this, void 0, void 0, function* () {
        return fetch(`https://forums.therian-guide.com/dustycode/discordapi.php?auth=${getPassword()}&operation=testUsername&query=${username}`)
            .then((response) => response.json())
            .then((body) => {
            console.log("response", body);
            return body.exists;
        });
    });
}
function checkIfStaff(member) {
    return __awaiter(this, void 0, void 0, function* () {
        const staffMembers = yield fetch(`https://forums.therian-guide.com/dustycode/discordapi.php?auth=${getPassword()}&operation=getStaff`)
            .then((response) => response.json())
            .then((body) => body.users.map((user) => user.username));
        console.log(staffMembers);
        const nickname = member.displayName;
        console.log(nickname);
        return staffMembers.includes(nickname);
    });
}
function getPassword() {
    const nowDate = new Date();
    const date = nowDate.getFullYear() +
        "-" +
        ("0" + (nowDate.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + nowDate.getDate()).slice(-2);
    const password = process.env.auth_password + date;
    const hash = require("crypto")
        .createHash("sha1")
        .update(password)
        .digest("hex");
    console.log("hash", hash);
    return hash;
}
