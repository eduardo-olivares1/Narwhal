const dotEnv = require('dotenv').config();

const ALLOWED_ROLES = process.env.PREFIX_CHANGE_ROLES.split(',');
const hasPermissions = (message) => {
    return message.member.roles.cache.some((role) => ALLOWED_ROLES.includes(role.name));
}

class Bind {
    name = 'bind';
    description = "Allows a user to change the discord text channel that Narwhal is bound to";

    constructor({prefixService, bindService}) {
        this.prefixService = prefixService;
        this.bindService = bindService;
    }

    async execute(message, args) {
        const prefix = this.prefixService.get();
        const currentBind = this.bindService.get();
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
            // the value comes in as '<#CHANNELID>'
            // so removing the first two, and last characters before storing.
            this.bindService.put(newChannel.slice(2, -1));
            message.channel.send(`Narwhal is now bound to ${newChannel}`);
            return;
        }

        if (args.length > 1){
            message.channel.send('The command `'+ prefix +'bind` only takes one (1) argument! Please try again!');
            return
        }

    }
}

module.exports = Bind