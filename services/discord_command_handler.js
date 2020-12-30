const _ = require('lodash');

// TODO: at some point, it probably makes sense to move this to a seperate command and have that print out useable commands.
// In the meantime, if a command cannot be found, use the Default Command.
const DEFAULT_COMMAND = {
    execute: (message, args) => {}
}

class DiscordCommandHandler {
    constructor(discordClient, prefix='$') {
        this._discordClient = discordClient;
        this._commandLookup = {}
        this.prefix = prefix;
    }

    registerCommands(commands) {
        for (const command of commands) {
            const name = command.name;
            if (name in this._commandLookup) {
                // command name collision
                console.log(`Command name collision. ${name} already exists, overwriting!`)
            }
            this._commandLookup[name] = command
        }
    }

    getCommand(command) {
        const fn = _.get(this._commandLookup, command, undefined);
        if (!fn) {
            console.log(`Command: ${command} not found. Using default.`)
            return DEFAULT_COMMAND
        }
        return fn
    }

    listen() {
        this._discordClient.on('message',  this._processCommand.bind(this))
    }

    _processCommand(message) {
        if (!message.content.startsWith(this.prefix) || message.author.bot) return;
        const args = message.content.slice(this.prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
        const commandObj = this.getCommand(command);
        commandObj.execute(message, args);
    }
}

module.exports = {
    DiscordCommandHandler: DiscordCommandHandler
}