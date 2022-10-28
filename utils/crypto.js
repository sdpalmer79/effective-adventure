const crypto = require('crypto');

const SIG_ENCODING = 'base64';
const HASH_ENCODING = 'base64';

module.exports = {
    hash: (data) => {
        return crypto.createHash('sha256')
            .update(data)
            .digest(HASH_ENCODING);
    },
    signData: (privateKey, data) => {
        const sign = crypto.createSign('sha256');
        sign.update(data);
        sign.end();
        return sign.sign(privateKey, SIG_ENCODING);
    },
    verifySign: (publicKey, signature, data) => {
        const verify = crypto.createVerify('sha256');
        verify.update(data);
        verify.end();
        return verify.verify(publicKey, signature, SIG_ENCODING);
    }
}
