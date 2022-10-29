const storage = require('../storage');
const aaa = require("./index");
const {signData, hash} = require("./index").crypto;

function getTxinDataForSign(transaction, indexToSign) {
    const txin = transaction.txins[indexToSign];
    const prevTxout = storage.mongo.fetchTxout(txin.previousOutput, txin.vout);

    const txins = transaction.txins.reduce((data, txin, currIndex) => {
        let txinData;
        if (currIndex === indexToSign) {
            const script = prevTxout.utxos[txin.previousOutput.vout].script;
            txinData = `${txin.previousOutput.txId}${script}${txin.previousOutput.vout}`;
        } else {
            txinData = `${txin.previousOutput.txId}${txin.previousOutput.vout}`;
        }
        return data.concat(txinData);
    }, '');

    const utxos = transaction.utxos.reduce((data, utxo) => data.concat(`${utxo.value}${utxo.script}`), '');
    return `${transaction.version}${txins}${utxos}${transaction.locktime}`.toString('utf8');
}

function getTxinDataForHash(transaction) {
    const txins = transaction.txins.reduce((data, txin, currIndex) => data.concat(`${txin.previousOutput.txId}${txin.verifyScript}${txin.previousOutput.vout}`), '');
    const utxos = transaction.utxos.reduce((data, utxo) => data.concat(`${utxo.value}${utxo.script}`), '');
    return `${transaction.version}${txins}${utxos}${transaction.locktime}`.toString('utf8');
}

module.exports = {
    getTxinDataForSign: (transaction, indexToSign) => getTxinDataForSign(transaction, indexToSign),
    signTxin: (transaction, indexToSign, privateKey) => {
        const dataToSign = getTxinDataForSign(transaction, indexToSign, privateKey)
        return signData(privateKey, hash(hash(dataToSign)));
    },
    hashTransaction: (transaction) => {
        const dataToHash = getTxinDataForHash(transaction);
        return hash(hash(dataToHash));
    }
};
