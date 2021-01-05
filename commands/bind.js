const localCache = require('../services/local_cache');
const dotEnv = require('dotenv').config();

const ALLOWED_ROLES = process.env.PREFIX_CHANGE_ROLES.split(',');
const hasPermissions = (message) => {
    return message.member.roles.cache.some((role) => ALLOWED_ROLES.includes(role.name));
}

module.exports = {
    name: 'bind',
    description: "Allows a user to change the discord text channel that Narwhal is bound to",
    execute(message, args){
        const cache = localCache.getInstance();
        const prefix = cache.get('PREFIX', 'value');
        const currentBind = cache.get('BIND', 'value');
        const regex = RegExp('<#[0-9]{18}>','gi');

        if (args.length < 1) {
            message.channel.send("No channel selected, please mention a channel for Narwhal to bind to like `"+ prefix +"bind #some-channel`");
            return;
        }
        if (!hasPermissions(message)){
            message.channel.send('You do not have permissions to change this.');
            return;
        }

        if (args.length === 1){
            if (args[0] === "check"){
                if (currentBind === ''){
                    message.channel.send("Narwhal is not currently bound to any channel! Please bind Narwhal to a channel to receive notifications!")
                    return
                }
                else{
                    message.channel.send(`Narwhal is currently bound to ${currentBind}`);
                    return;
                }
            }

            const newChannel = args[0];
            if (regex.test(newChannel) === false){
                message.channel.send(`${newChannel} is not something Narwhal can bind to :P . Try binding Narwhal to a channel by using the "#" channel prefix!`);
                return;
            }
            cache.put('BIND', 'value', newChannel); 
            message.channel.send(`Narwhal is now bound to ${newChannel}`);
            return;

        }

        if (args.length > 1){
            message.channel.send('The command `'+ prefix +'bind` only takes one (1) argument! Please try again!');
            return
        }

    }
}