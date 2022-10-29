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
    const digest = crypto.hashRipemd160(crypto.hash(crypto.hash(val1)));
    stack.push(digest);
}

function checkSig(stack, transaction, txinIndex) {
    const signature = stack.pop();
    const publicKey = stack.pop();
    const dataToSign = transactions.getTxinDataForSign(transaction, txinIndex)
    stack.push(crypto.verifySign(publicKey, signature, dataToSign));
}

module.exports = {
    runVerifyScript: (script, stack, transaction, txinIndex) => {
        if (!stack) {
            stack = [];
        }
        script.split(' ').forEach((opcode) => {
            switch (opcode) {
                case 'OP_DUP':
                    dup(stack);
                    break;
                case 'OP_EQUALVERIFY':
                    equalVerify(stack);
                    break;
                case 'OP_HASH160':
                    hash160(stack)
                    break;
                case 'OP_CHECKSIG':
                    checkSig(stack, transaction, txinIndex);
                    break;
                default:
                    stack.push(opcode);
            }
        });
        return stack;
    }
}
