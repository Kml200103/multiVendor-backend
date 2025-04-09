const socketHandler = require('./socketHandler');
const orderUpdates = require('./orderUpdates');

module.exports = (io) => {
    socketHandler(io);
    orderUpdates(io);
};
