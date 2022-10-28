const transactions = require('../utils/transactions');
const crypto = require('../utils/crypto');
const storage = require("../storage");

function dup(stack) {
    const val = stack.pop();
    stack.push(val);
    stack.push(val);
}

function equalVerify(stack) {
    const val1 = stack.pop();
    const val2 = stack.pop();
    stack.push(val1 === val2);
}

function hash160(stack) {
    const val1 = stack.pop();
    stack.push(crypto.hash(crypto.hash(val1)));
}

function checkSig(stack, transaction, txinIndex) {
    const signature = stack.pop();
    const publicKey = stack.pop();
    const dataToSign = transactions.getTxinDataForSign(transaction, txinIndex)
    stack.push(crypto.verifySign(publicKey, signature, dataToSign));
}

module.exports = {
    runVerifyScript: (transaction, txinIndex) => {
        const stack = [];
        //const
        const prevTxout = storage.mongo.fetchTxout(txin.previousOutput, txin.vout);
        const verifyScript = transaction.txins[txinIndex].verifyScript;

        verifyScript.split(' ').forEach((opcode) => {
            switch (opcode) {
                case 'OP_DUP':
                    dup(stack);
                    break;
                case 'OP_EQUALVERIFY':
                    equalVerify(stack);
                    break;
                case 'HASH160':
                    hash160(stack)
                    break;
                case 'OP_CHECKSIG':
                    checkSig(stack, transaction, txinIndex);
                    break;
                default:
                    stack.push(opcode);
            }
        });
    }
}
