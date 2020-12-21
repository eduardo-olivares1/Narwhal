//Import required dependencies + files
const dotEnv = require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');

//Import environment variables 
const discordToken = process.env.DISCORD_TOKEN;

//Create Discord Client
const client = new Discord.Client();

//Set Up Commands
const prefix = "$"; 
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () =>{
    console.log('Bot is online!');
});


client.on('message', message =>{
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping'){
        client.commands.get('ping').execute(message, args);
    }
});

client.login(discordToken);