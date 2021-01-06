// Use this as a local cache storage
// 
// The way you can think about this is:
// Each thing will have a top level name (i.e. PREFIX), this will be called a `collection`.
// Every collection will be comprised of an object that is up to the user to use as they need.
// TODO: This probably becomes an issue later on when namespace collisions start happening, at which point this probably cant be used anyway
// but until we need to scale to a database, we can use this as a way to hold state.
//
// LocalCache is provided via Dependency Injection.
// If a new job or command is being created and the cache is needed,
// create a service for it, and inject the service into the job/command,
// jobs
//
// Usage:
// cache.put('PREFIX', value, newPrefix)
// cache.get('PREFIX', value)

const _ = require('lodash');

class LocalCache {
    constructor() {
        this.storage = {
            'PREFIX': {
                'value': '$'
            },
            'BIND': {
                'value': ''
            },
            'COINS': {}
        }
    }

    put(collectionName, key, value) {
        const collection = _.get(this.storage, collectionName, undefined);
        if (!collection) {
            throw Error(`${collectionName} is not a registered collection for LocalStorage`)
        }
        _.set(this.storage, `${collectionName}.${key}`, value)
    }

    get(collectionName, key) {
        const collection = this.getAll(collectionName);
        if (!collection) return undefined;
        return _.get(collection, key)
    }

    getAll(collectionName) {
        return _.get(this.storage, collectionName, undefined);
    }
}

module.exports = LocalCache
