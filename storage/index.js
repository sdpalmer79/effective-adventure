const mongo = require('./mongo');

module.exports = {
    mongo: {
        fetchTxout: (transactionId) => mongo.fetchTxout(transactionId)
    }
}
