const {transactions, crypto} = require('./utils');
const opCodes = require('./op_codes');
const {generateKeyPairSync} = require('crypto');
const storage = require("./storage");

//add address version field to tranaction
//sighash - which parts of transaction are hashed for signature
//ecdsa encryption
//no partial spending
//execute verifyScript and script seperatly
//for transaction hash - hash all after txins have been signed

const transaction = {
    txins: [
        {
            previousOutput: {txId: 'aaa', vout: '0'},
            verifyScript: 'todo',
        }
    ],
    utxos: [
        {
            value: 5,
            script: 'todo'
        }
    ],
    locktime: Math.floor(new Date().getTime() / 1000),
    version: 1,
    txId: '', //hash of transaction
}

//sign txins
const {privateKey, publicKey} = generateKeyPairSync('ec', {namedCurve: 'secp256k1'});
transaction.txins.forEach((txin, index) => {
    const signature = transactions.signTxin(transaction, index, privateKey);
    txin.verifyScript = `${signature} ${publicKey}`
});

transaction.txId = transactions.hashTransaction(transaction);

transaction.txins.forEach((txin, index) => {
    const prevTxout = storage.mongo.fetchTxout(txin.previousOutput, txin.vout);

    let stack = opCodes.runVerifyScript(txin.verifyScript);
    stack = opCodes.runVerifyScript(prevTxout.script, stack, transaction, index);
});

console.log(transaction.toString());

const data = 'abc';
const encoding = 'base64';
const sigVerified = utils.verifySign(publicKey, signature, data, encoding);
console.log(sigVerified);
