// Commands
const CommandHandler = require('./command_handler');
const CommandRegistry = require ('../commands/command_registry');

// Jobs
const JobHandler = require('./job_handler');
const JobRegistry = require('../jobs/jobs_registry');

// Services
const localCache = require('../services/local_cache'); // not really a service...

const load = (discordClient) => {
    return async () => {
        // Register jobs
        console.log('Registering jobs.')
        const jobHandler = new JobHandler(discordClient, localCache.getInstance());
        await jobHandler.register(JobRegistry.getAll());

        //Register discord commands and listen
        console.log('Registering commands.')
        const commandHandler = new CommandHandler(discordClient, localCache.getInstance());
        commandHandler.register(CommandRegistry.getAll())
        commandHandler.listen();

        console.log('Bot is online!');
    }
}

module.exports = {
    load: load
}