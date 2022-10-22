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

function hash160(script) {

}

function checkSig(script) {

}

module.exports = {
    executeScript: (script) => {
        const stack = [];
        script.split(' ').forEach((opcode) => {
            switch (opcode) {
                case 'OP_DUP':
                    dup(stack);
                    break;
                case 'OP_EQUALVERIFY':
                    equalVerify(stack);
                    break;
                case 'HASH160':
                    hash160(script)
                    break;
                case 'OP_CHECKSIG':
                    checkSig(script)
                    break;
                default:
                    stack.push(opcode);
            }
        });
    }
}
