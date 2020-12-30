const _ = require('lodash');
const request = require('request');

module.exports = {
    name: 'ping',
    description: "A simple ping command to check if API services are active",
    execute(message, args){ 
        if (_.isEmpty(args)) return;
        if (args[0].toLowerCase() === "coingecko"){
            request('https://api.coingecko.com/api/v3/ping', { json: true },  function(err, res, body) {
                message.channel.send("CoinGecko says: " + body['gecko_says']);
            });
            return;
        }

    }
}