const { asClass } = require('awilix');

const services = {
    discordClient: asClass(require('./discord_client.service')).singleton(),
    bindService: asClass(require('./bind.service')).singleton(),
    localCache: asClass(require('./local_cache')).singleton(),
    prefixService: asClass(require('./prefix.service')).singleton(),
    coinsService: asClass(require('./coins.service')).singleton()
}

module.exports = {
    register: (container) => container.register(services)
}