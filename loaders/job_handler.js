class JobHandler {
    constructor(discordClient, cache) {
        this.discordClient = discordClient
        this.cache = cache
    }

    async register(jobs) {
        for (const job of jobs){
            const jobObj = new job(this.discordClient, this.cache);
            await jobObj.init() // This is kinda hacky but needed until we have persistent storage.
            if (jobObj.jobType === 'TimeInterval') {
                this.discordClient.setInterval(jobObj.run.bind(jobObj), jobObj.timeInterval);
            }
        }
    }
}

module.exports = JobHandler;