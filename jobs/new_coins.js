const axios = require('axios');
const _ = require('lodash');
const URL = 'https://api.coingecko.com/api/v3/coins/list';

class NewCoinsJob {
    jobType = 'TimeInterval';
    timeInterval = 10000;

    constructor(discordClient, cache) {
        this.discordClient = discordClient;
        this.cache = cache;
    }

    async init() {
        const resp = await axios.get(URL);
        _.forEach(resp.data, (coin) => this.cache.put('COINS', coin.id, coin));
    }
    
    async run() {
        const resp = await axios.get(URL);
        const prevCoins = this.cache.getAll('COINS');
        const boundChannel = this.cache.get('BIND', 'value');
        if (_.keys(prevCoins).length === resp.data.length) return;
        if (boundChannel === '') return;
        const newCoins = _.filter(resp.data, (coin) => !(coin.id in prevCoins));
        _.forEach(newCoins, (coin) => {
            this.cache.put('COINS', coin.id, coin);
            this.discordClient.channels.cache.get(boundChannel).send(
                'New coin listed on CoinGecko: **' + coin.name + "** \nhttps://www.coingecko.com/en/search_redirect?id="+coin.id+"&type=coin");
        });
    }
}

module.exports = NewCoinsJob