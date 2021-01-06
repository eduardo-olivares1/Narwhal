require('dotenv').config();
const Discord = require('discord.js');
const loader = require('./loaders/index');

const discordToken = process.env.DISCORD_TOKEN;
const client = new Discord.Client();

client.login(discordToken);
client.once('ready', loader.load(client));
