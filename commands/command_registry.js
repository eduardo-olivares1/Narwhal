const narwhalPrefix = require('./narwhal_prefix');
const ping = require('./ping');

const commands = [
    narwhalPrefix,
    ping
];

module.exports = {
    getAll: () => commands
}