// Import local dependencies
const commandHandler = require('./services/discord_command_handler')
const commandRegistry = require ('./commands/command_registry.js');

//Import required dependencies + files
const dotEnv = require('dotenv').config();
const Discord = require('discord.js');
const request = require('request');

//Import environment variables 
const discordToken = process.env.DISCORD_TOKEN;

//Create Discord Client
const client = new Discord.Client();

//Create Initial Coin List
let coinList = [];
request('https://api.coingecko.com/api/v3/coins/list', { json: true },  function(err, res, body) {
    coinList = body;
    });

client.once('ready', () =>{
    console.log('Bot is online!');
});

//Register discord commands
const discordCommandHandler = new commandHandler.DiscordCommandHandler(client);
discordCommandHandler.registerCommands(commandRegistry.getAll())
discordCommandHandler.listen();

const timeInterval = 60 * 60 * 1000;

client.setInterval(() => {
    request('https://api.coingecko.com/api/v3/coins/list', { json: true },  function(err, res, body) {
        console.log(body.length,coinList.length);
        if (body.length != coinList.length){
            const localCoinList = require('./coin-list.json');
            const apiCoinList = body;

            function containsCoin(objList, obj) {
                for (let i = 0; i < objList.length; i++) {
                    if (objList[i].id === obj.id) {
                        return true;
                    }
                }
                return false;
            }

            for (let i = 0; i < apiCoinList.length; i++){
                let coinBool = containsCoin(localCoinList, apiCoinList[i]);
                if (coinBool === false){
                    client.channels.cache.get('<CHANNEL ID>').send('New coin listed on CoinGecko: **' + apiCoinList[i].name + "** \nhttps://www.coingecko.com/en/search_redirect?id="+apiCoinList[i].id+"&type=coin");
                }
            }
            coinList = body;
            return true;
        }
    });
},timeInterval);

client.login(discordToken);