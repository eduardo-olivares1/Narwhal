const commands = [
    require('./narwhal_prefix'),
    require('./ping'), 
    require('./bind')
];

module.exports = {
    getAll: () => commands
}