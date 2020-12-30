const localCache = require('../services/local_cache');
const dotEnv = require('dotenv').config();
const _ = require('lodash');

const ALLOWED_ROLES = process.env.PREFIX_CHANGE_ROLES.split(',');
const hasPermissions = (message) => {
    return message.member.roles.cache.some((role) => ALLOWED_ROLES.includes(role.name));
}

module.exports = {
    name: 'narwhalPrefix',
    description: "Allows a user to change the prefix for Narwhal. Default is `$`",
    execute(message, args){
        if (args.length != 1) {
            message.channel.send('EHHHHH...Use it like this: <current prefix>prefix <new prefix>');
            return;
        }
        if (!hasPermissions(message)){
            message.channel.send('You do not have permissions to change this.');
            return;
        }
        const cache = localCache.getInstance();
        const newPrefix = args[0]
        cache.put('PREFIX', 'value', newPrefix);
        message.channel.send(`You may now speak to me using ${newPrefix}`);
    }
}