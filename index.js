const transactions = require('./transactions');
const opCodes = require('./op_codes');
const {generateKeyPairSync} = require('crypto');
const storage = require("./storage");
const cryptoUtils = require('./cryptoUtils')

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

//let {privateKey, publicKey} = generateKeyPairSync('ec', {namedCurve: 'secp256k1'});
//const privKey = cryptoUtils.privKeyToBase64(privateKey);
//const pubKey = cryptoUtils.pubKeyToBase64(publicKey);
const privKey = 'MIGEAgEAMBAGByqGSM49AgEGBSuBBAAKBG0wawIBAQQgyS9sUq+6PIpDV6t3U4lI5mN6eqc9eZApHLcuHJLdydChRANCAARA2+aVb0FG+OUlZv+jcH/BOQey7q/glCbn6fDBYZfFNTR3BWvpYFDiqiR16GzNdYwLnEdtNYWyVPEjoCCqQS24'
const pubKey = 'MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEQNvmlW9BRvjlJWb/o3B/wTkHsu6v4JQm5+nwwWGXxTU0dwVr6WBQ4qokdehszXWMC5xHbTWFslTxI6AgqkEtuA=='

//sign txins
transaction.txins.forEach((txin, index) => {
    const signB64 = transactions.signTxin(transaction, index, privKey);
    txin.verifyScript = `${signB64} ${pubKey}`
});

transaction.txId = transactions.hashTransaction(transaction);

transaction.txins.forEach((txin, index) => {
    const prevTxout = storage.mongo.fetchTxout(txin.previousOutput);
    const script = prevTxout.utxos[txin.previousOutput.vout].script;
    let stack = opCodes.runVerifyScript(txin.verifyScript);
    stack = opCodes.runVerifyScript(script, stack, transaction, index);

    if (stack.pop() !== true) {
        throw new Error('');
    }
});

console.log(transaction.toString());

//const data = 'abc';
//const encoding = 'base64';
//const sigVerified = utils.verifySign(publicKey, signature, data, encoding);
//console.log(sigVerified);
