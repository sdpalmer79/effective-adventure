const {transactions} = require('./utils');

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

function fetchTxout() {
    return {
        utxos: [
            {
                value: 5,
                script: 'OP_DUP OP_HASH160 xxxx OP_EQUALVERIFY OP_CHECKSIG'
            }
        ],
        locktime: Math.floor(new Date().getTime() / 1000),
        version: 1,
        txId: '123', //hash of transaction
    }
}


//sign txins
const {privateKey, publicKey} = crypto.generateKeyPairSync('ec', {namedCurve: 'secp256k1'});
transaction.txins.forEach((txin, index) => {
    const signature = transactions.signTxin(transaction, index, privateKey);
    txin.verifyScript = `${signature} ${publicKey}`
});

transaction.txId = '';

console.log(transaction.toString());

const data = 'abc';
const encoding = 'base64';
const sigVerified = utils.verifySign(publicKey, signature, data, encoding);
console.log(sigVerified);
