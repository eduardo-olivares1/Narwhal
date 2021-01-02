const { asClass } = require('awilix');

const services = {
    //discordClient is also available, but it's added to the container in loaders/index.js
    // discordClient: awilix.asValue(discordClient),
    bindService: asClass(require('./bind.service')).singleton(),
    localCache: asClass(require('./local_cache')).singleton(),
    prefixService: asClass(require('./prefix.service')).singleton(),
    coinsService: asClass(require('./coins.service')).singleton()
}

module.exports = {
    register: (container) => container.register(services)
}