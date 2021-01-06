const _ = require('lodash');
const CoinGecko = require('coingecko-api');

class Ping {
    name = 'ping';
    description = "A simple ping command to check if API services are active";

    constructor() { 
        this.coinGeckoClient = new CoinGecko(); 
    }
    
    async execute(message, args) { 
        if (_.isEmpty(args)) return;
        if (args[0].toLowerCase() === "coingecko"){
            const resp = await this.coinGeckoClient.ping();
            if (200 <= resp.code && resp.code <= 299){
                message.channel.send("CoinGecko says: " + resp.data['gecko_says']);
            } else {
                message.channel.send("CoinGecko says: request failed")
            }
        }
    }
}

module.exports = Ping