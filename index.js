//Import environment variables 
const dotEnv = require('dotenv').config();
const discordToken = process.env.DISCORD_TOKEN;
const twitterToken = process.env.TWITTER_TOKEN;

const Discord = require('discord.js'); 

const client = new Discord.Client();

client.once('ready', () => {
    console.log('Narwhal is online!');
});


client.login(discordToken);