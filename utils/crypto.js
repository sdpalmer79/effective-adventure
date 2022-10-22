const crypto = require('crypto');

module.exports = {
    hash: (data, encoding) => {
        return crypto.createHash('sha256')
            .update(data)
            .digest(encoding);
    },
    signData: (privateKey, data, encoding) => {
        const sign = crypto.createSign('sha256');
        sign.update(data);
        sign.end();
        return sign.sign(privateKey, encoding);
    },
    verifySign: (publicKey, signature, data, encoding) => {
        const verify = crypto.createVerify('sha256');
        verify.update(data);
        verify.end();
        return verify.verify(publicKey, signature, encoding)
    }
}
