const _ = require('lodash');

class NewCoinsJob {
    jobType = 'TimeInterval';
    timeInterval = 10000;

    constructor({discordClient, coinsService, bindService}) {
        this.discordClient = discordClient;
        this.coinsService = coinsService;
        this.bindService = bindService;
    }

    async init(){}
    
    async run() {
        const boundChannel = this.bindService.get();
        if (!boundChannel) {
            console.log('No channel was bound, early out of NewCoinsJob.');
            return;
        }
        const newCoins = await this.coinsService.fetchNewCoins();        
        _.forEach(newCoins, (coin) => {
            this.discordClient.channels.cache.get(boundChannel).send(
                'New coin listed on CoinGecko: **' + coin.name + "** \nhttps://www.coingecko.com/en/search_redirect?id="+coin.id+"&type=coin");
        });
        this.coinsService.store(newCoins);
    }
}

module.exports = NewCoinsJob