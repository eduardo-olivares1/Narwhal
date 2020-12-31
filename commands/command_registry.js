const commands = [
    require('./narwhal_prefix'),
    require('./ping')
];

module.exports = {
    getAll: () => commands
}