const { asClass } = require("awilix");

class JobHandler {
    constructor({discordClient}) {
        this.discordClient = discordClient
    }

    async register(container, jobs) {
        for (const job of jobs){
            const jobNamespace = `job.${job.name}`
            container.register(jobNamespace, asClass(job));
            const jobObj = container.resolve(jobNamespace);
            await jobObj.init() // This is kinda hacky but needed until we have persistent storage.
            if (jobObj.jobType === 'TimeInterval') {
                this.discordClient.setInterval(jobObj.run.bind(jobObj), jobObj.timeInterval);
            }
        }
    }
}

module.exports = JobHandler;