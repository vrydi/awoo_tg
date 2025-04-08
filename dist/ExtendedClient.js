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
        const commandFiles = (0, getFiles_1.getFiles)("./commands");
        for (const file of commandFiles) {
            const command = require(file).default;
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
exports.ExtendedClient = ExtendedClient;
