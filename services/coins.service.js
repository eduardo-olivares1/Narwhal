const _ = require('lodash');
const CoinGecko = require('coingecko-api');

class CoinsService {
    constructor({localCache}) { 
        this.localCache = localCache;
        this.client = new CoinGecko();

        // TODO/HACK: whats the idiomatic way to do this??
        this.init = this.init.bind(this);
        this.init();
    }

    async init() {
        const resp = await this.client.coins.list();
        _.forEach(resp.data, (coin) => this.localCache.put('COINS', coin.id, coin));
    }

    async fetchNewCoins() {
        const resp = await this.client.coins.list();
        const prevCoins = this.localCache.getAll('COINS');
        if (_.keys(prevCoins).length === resp.data.length) return;
        return _.filter(resp.data, (coin) => !(coin.id in prevCoins));
    }

    get(coinId) {
        return this.localCache.get('COINS', coinId);
    }

    store(coins){
        _.forEach(coins, (coin) => this.localCache.put('COINS', coin.id, coin));
    }
}

module.exports = CoinsService;