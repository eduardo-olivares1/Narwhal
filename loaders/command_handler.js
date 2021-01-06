const { asClass } = require('awilix');
const _ = require('lodash');

// TODO: at some point, it probably makes sense to move this to a seperate command and have that print out useable commands.
// In the meantime, if a command cannot be found, use the Default Command.
const DEFAULT_COMMAND = {
    execute: (message, args) => {}
}

class DiscordCommandHandler {
    constructor({discordClient, prefixService}) {
        this.discordClient = discordClient;
        this.prefixService = prefixService;
        this._commandLookup = {}
    }

    register(container, commands) {
        for (const command of commands) {
            const commandNamespace = `command.${command.name}`
            container.register(commandNamespace, asClass(command));
            const cmd = container.resolve(commandNamespace)
            if (cmd.name in this._commandLookup) {
                // command name collision
                console.log(`Command name collision. ${cmd.name} already exists, overwriting!`)
            }
            this._commandLookup[cmd.name] = cmd;
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
        this.discordClient.onMessage(this._processCommand.bind(this));
    }

    _processCommand(message) {
        const registeredPrefix = this.prefixService.get();
        if (!message.content.startsWith(registeredPrefix) || message.author.bot) return;
        const args = message.content.slice(registeredPrefix.length).split(/ +/);
        const command = args.shift();
        const commandObj = this.getCommand(command);
        try {
            // The typing stuff seems to be buggy.
            // message.channel.startTyping();
            commandObj.execute(message, args);
        } catch(err) {
            console.log(`Message: ${message.content} errored with:`);
            console.log(err);
        } finally {
            // message.channel.stopTyping()
        }
    }
}

module.exports = DiscordCommandHandler