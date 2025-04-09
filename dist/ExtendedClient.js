"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedClient = void 0;
const discord_js_1 = require("discord.js");
const getFiles_1 = require("./getFiles");
class ExtendedClient extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this.commands = new discord_js_1.Collection();
    }
    init() {
        this.registerEvents();
        this.registerCommands();
    }
    registerEvents() {
        const eventFiles = require("fs")
            .readdirSync("./events")
            .filter((file) => file.endsWith(".js"));
        for (const file of eventFiles) {
            const event = require(`./events/${file}`).default;
            if (!event.name) {
                console.error(`Event ${file} does not have a name`);
                continue;
            }
            if (!event.execute) {
                console.error(`Event ${file} does not have an execute function`);
                continue;
            }
            if (event.once) {
                this.once(event.name, (...args) => event.execute(...args));
            }
            else {
                this.on(event.name, (...args) => event.execute(...args));
            }
        }
    }
    registerCommands() {
        var _a, _b;
        const commandFiles = (0, getFiles_1.getFiles)("./commands");
        for (const file of commandFiles) {
            const command = require(file).default;
            console.debug((_a = command.data) === null || _a === void 0 ? void 0 : _a.constructor.name, file);
            if (((_b = command.data) === null || _b === void 0 ? void 0 : _b.constructor.name) !== "SlashCommandBuilder") {
                const split = file.replace(/\\/g, "/").split("/");
                console.log(split, `${file.split("/")[2]}:${split[split.length - 1]
                    .replace(".js", "")
                    .toLowerCase()}`);
                this.commands.set(`${file.split("/")[2]}:${split[split.length - 1]
                    .replace(".js", "")
                    .toLowerCase()}`, command);
            }
            else {
                if (!command.name) {
                    console.error(`Command ${file} does not have a name`);
                    continue;
                }
                if (!command.execute) {
                    console.error(`Command ${file} does not have an execute function`);
                    continue;
                }
                this.commands.set(command.name, command);
            }
        }
    }
}
exports.ExtendedClient = ExtendedClient;
