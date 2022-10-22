const crypto = require('./crypto');
const transactions = require('./transactions');

module.exports = {
    crypto: {
        hash: (data, encoding) => crypto.hash(data, encoding),
        signData: (privateKey, data, encoding) => crypto.signData(privateKey, data, encoding),
        verifySign: (publicKey, signature, data, encoding) => crypto.verifySign(publicKey, signature, data, encoding)
    }
    ,
    transactions: {
        signTxin: (transaction, indexToSign, privateKey, options) => transactions.signTxin(transaction, indexToSign, privateKey, options)
    }
};
