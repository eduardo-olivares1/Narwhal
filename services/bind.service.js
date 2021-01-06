class BindService {
    constructor({localCache}) { 
        this.localCache = localCache 
    }
    get = () => this.localCache.get('BIND', 'value');
    put = (newChannel) => this.localCache.put('BIND', 'value', newChannel);
}

module.exports = BindService