// Dependency Injection library
const awilix = require('awilix');

// Commands
const CommandHandler = require('./command_handler');
const CommandRegistry = require ('../commands/command_registry');

// Jobs
const JobHandler = require('./job_handler');
const JobRegistry = require('../jobs/jobs_registry');

// Services
const ServiceRegistry = require('../services/service_registry');

const load = (discordClient) => {
    return async () => {
        // Create dependency injection container
        const container = awilix.createContainer();

        //Register top level modules
        container.register({
            discordClient: awilix.asValue(discordClient),
            _jobHandler: awilix.asClass(JobHandler).singleton(),
            _commandHandler: awilix.asClass(CommandHandler).singleton()
        })

        // Register Services
        console.log('Registering services.');
        ServiceRegistry.register(container);

        // Register jobs
        console.log('Registering jobs.')
        const jobHandler = container.resolve('_jobHandler');
        await jobHandler.register(container, JobRegistry.getAll());

        //Register discord commands and listen
        console.log('Registering commands.')
        const commandHandler = container.resolve('_commandHandler');
        commandHandler.register(container, CommandRegistry.getAll())
        commandHandler.listen();

        console.log('Bot is online!');
    }
}

module.exports = {
    load: load
}