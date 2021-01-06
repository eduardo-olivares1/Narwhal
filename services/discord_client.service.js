class DiscordClientService {
    constructor({_rawDiscordClient, bindService}){
        this.rawDiscordClient = _rawDiscordClient;
        this.bindService = bindService;
    }

    onMessage(callback) {
        this.rawDiscordClient.on('message', callback);
    }

    setInterval(callback, timeInterval) {
        this.rawDiscordClient.setInterval(callback, timeInterval);
    }

    sendMessage(msg) {
        const boundChannel = this.bindService.get();
        if (!boundChannel) {
            console.log(`No channel is bound. Message: "${msg}" will not be sent.`);
            return
        }
        this.rawDiscordClient.channels.cache.get(boundChannel).send(msg);
    }
}

module.exports = DiscordClientService;