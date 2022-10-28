const mongo = require('./mongo');

module.exports = {
    mongo: {
        fetchTxout: () => mongo.fetchTxout()
    }
}
