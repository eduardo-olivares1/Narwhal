class PrefixService{
    constructor({localCache}) { 
        this.localCache = localCache 
    }
    get = () => this.localCache.get('PREFIX', 'value') || '$';
    put = (newPrefix) => this.localCache.put('PREFIX', 'value', newPrefix);
}

module.exports = PrefixService