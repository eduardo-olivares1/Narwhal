const dotEnv = require('dotenv').config();

const ALLOWED_ROLES = process.env.PREFIX_CHANGE_ROLES.split(',');
const hasPermissions = (message) => {
    return message.member.roles.cache.some((role) => ALLOWED_ROLES.includes(role.name));
}

class NarwhalPrefix {
    name = 'narwhalPrefix';
    description = "Allows a user to change the prefix for Narwhal. Default is `$`";

    constructor({prefixService}) {
        this.prefixService = prefixService;
    }
    
    async execute(message, args){
        if (args.length != 1) {
            message.channel.send('EHHHHH...Use it like this: <current prefix>narwhalPrefix <new prefix>');
            return;
        }
        if (!hasPermissions(message)){
            message.channel.send('You do not have permissions to change this.');
            return;
        }
        const newPrefix = args[0]
        this.prefixService.put(newPrefix);
        message.channel.send(`You may now speak to me using ${newPrefix}`);
    }
}

module.exports = NarwhalPrefix