const crypto = require('./crypto');
const transactions = require('./transactions');

module.exports = {
    crypto: {
        hash: (data) => crypto.hash(data),
        signData: (privateKey, data) => crypto.signData(privateKey, data),
        verifySign: (publicKey, signature, data) => crypto.verifySign(publicKey, signature, data)
    },
    transactions: {
        getTxinDataForSign: (transaction, indexToSign) => transactions.getTxinDataForSign(transaction, indexToSign),
        signTxin: (transaction, indexToSign, privateKey) => transactions.signTxin(transaction, indexToSign, privateKey),
        hashTransaction: (transaction) => transactions.hashTransaction(transaction)
    }
};
