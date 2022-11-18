const crypto = require('crypto');

const SIG_ENCODING = 'base64';
const HASH_ENCODING = 'base64';

function hash(data, digestMethod, encoding) {
    return crypto.createHash(digestMethod)
        .update(data, encoding)
        .digest(HASH_ENCODING);
}

function base64ToPrivKey(keyObject) {
    return crypto.createPrivateKey({key: key, format: 'der', type: 'pkcs8', encoding: 'base64'});
}

function base64ToPubKey(keyObject) {
    return crypto.createPublicKey({key: key, format: 'der', type: 'spki', encoding: 'base64'});
}

//TODO - should pass in data encoding!!!

module.exports = {
    hash256: (data, encoding) => hash(data, 'sha256', encoding),
    hashRipemd160: (data, encoding) => hash(data, 'ripemd160', encoding),
    signData: (key, data, encoding) => {
        const sign = crypto.createSign('sha256');
        sign.update(data, encoding);
        sign.end();
        return sign.sign(base64ToPrivKey(key), SIG_ENCODING);
    },
    verifySign: (key, signature, data, encoding) => {
        const verify = crypto.createVerify('sha256');
        verify.update(data, encoding);
        verify.end();
        return verify.verify(base64ToPubKey(key), signature, SIG_ENCODING);
    },
    base64ToPrivKey: (key) => base64ToPrivKey(key),
    base64ToPubKey: (key) => base64ToPubKey(key),
    privKeyToBase64: (keyObject) => {
        const bytes = keyObject.export({type: 'pkcs8', format: 'der'});
        return Buffer.from(bytes).toString('base64');
    },
    pubKeyToBase64: (keyObject) => {
        const bytes = keyObject.export({type: 'spki', format: 'der'});
        return Buffer.from(bytes).toString('base64');
    }
}
