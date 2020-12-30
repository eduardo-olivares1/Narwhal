const _ = require('lodash');
const localCache = require('./local_cache');

// TODO: at some point, it probably makes sense to move this to a seperate command and have that print out useable commands.
// In the meantime, if a command cannot be found, use the Default Command.
const DEFAULT_COMMAND = {
    execute: (message, args) => {}
}

class DiscordCommandHandler {
    constructor(discordClient, prefix='$') {
        this._discordClient = discordClient;
        this._commandLookup = {}
        this.cache = localCache.getInstance();
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
        const registeredPrefix = this._getPrefix(message);
        if (!message.content.startsWith(registeredPrefix) || message.author.bot) return;
        const args = message.content.slice(registeredPrefix.length).split(/ +/);
        const command = args.shift();
        const commandObj = this.getCommand(command);
        commandObj.execute(message, args);
    }

    _getPrefix(message) {
        return this.cache.get('PREFIX', 'value') || '$';
    }
}

module.exports = {
    DiscordCommandHandler: DiscordCommandHandler
}