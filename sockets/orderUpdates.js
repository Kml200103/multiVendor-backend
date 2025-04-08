const Order=require('../models/Order')

module.exports = (io) => {
    const watchOrderUpdates = async () => {
        const changeStream = Order.watch();

        changeStream.on('change', (change) => {
            if (change.operationType === 'update') {
                const updatedFields = change.updateDescription.updatedFields;
                io.emit('orderStatusUpdated', { orderId: change.documentKey._id, updatedFields });
            }
        });
    };

    watchOrderUpdates();
};
