module.exports = {
    fetchTxout: () => {
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
}
