const crypto = require("./crypto.js");

function getTxinData(transaction, indexToSign, prevTxout) {
    return transaction.txins.reduce((data, txin, currIndex) => {
        let txinData;
        if (currIndex === indexToSign) {
            const script = prevTxout.utxos[txin.previousOutput.vout].script;
            txinData = `${txin.previousOutput.txId}${script}${txin.previousOutput.vout}`;
        } else {
            txinData =  `${txin.previousOutput.txId}${txin.previousOutput.vout}`;
        }
        return data.concat(txinData);
    }, '');
}

function getUtxoData(transaction) {
    return transaction.utxos.reduce((data, utxo) => data.concat(`${utxo.value}${utxo.script}`), '');
}

function getTxinDataForSign(transaction, indexToSign, options) {
    const txin = transaction.txins[indexToSign];
    const prevTxout = fetchTxout(txin.previousOutput, txin.vout);

    const txins = getTxinData(transaction, indexToSign, prevTxout)
    const utxos = getUtxoData(transaction);
    return `${transaction.version}${txins}${utxos}${transaction.locktime}`.toString('utf8');
}

module.exports = {
    signTxin: (transaction, indexToSign, privateKey, options) => {
        const dataToSign = getTxinDataForSign(transaction, indexToSign, privateKey, options)
        return crypto.signData(privateKey, crypto.hash(crypto.hash(dataToSign)), 'base64');
    },
    hashTransaction: (transaction) => {

    }
};
