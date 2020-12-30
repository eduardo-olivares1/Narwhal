const ping = require('./ping');
const commands = [
    ping
];

module.exports = {
    getAll: () => commands
}