/* eslint-disable no-console */

const crypto = require('crypto');

/*
  Task 1: Identify the correct symmetric key
  Keys in HEX:
    - Key 1: 68544020247570407220244063724074
    - Key 2: 54684020247570407220244063724074
    - Key 3: 54684020247570407220244063727440
  SHA-256 hash of the correct key (in HEX):
    - f28fe539655fd6f7275a09b7c3508a3f81573fc42827ce34ddf1ec8d5c2421c3
*/
const keys = [
  '68544020247570407220244063724074',
  '54684020247570407220244063724074',
  '54684020247570407220244063727440',
];
const correctHash = 'f28fe539655fd6f7275a09b7c3508a3f81573fc42827ce34ddf1ec8d5c2421c3';
for (const key of keys) {
  const hash = crypto.createHash('sha256').update(Buffer.from(key, 'hex')).digest('hex');

  console.log(`Key: ${key}`);
  console.log(`Hash: ${hash}`);
  console.log(`Matches: ${hash === correctHash}\n`);
}

// Answer:
// Key: 68544020247570407220244063724074
// Hash: 8f7c7aa61c742c533c1911f3bf15a62641f01e8fcaceef252bf26a5f7a53b046
// Matches: false
// Key: 54684020247570407220244063724074
// Hash: f28fe539655fd6f7275a09b7c3508a3f81573fc42827ce34ddf1ec8d5c2421c3
// Matches: true
// Key: 54684020247570407220244063727440
// Hash: c667de9c047a7481799b16d5c3f3547064f6cb7ac40b2145a02582b1c734c717
// Matches: false
/*
  Task 2: Decrypt the AES-128 encrypted message
  AES encrypted message (in HEX):
    - 876b4e970c3516f333bcf5f16d546a87aaeea5588ead29d213557efc1903997e
  CBC initialization vector (in HEX):
    - 656e6372797074696f6e496e74566563
*/
const correctKeyHex = '54684020247570407220244063724074';
const key = Buffer.from(correctKeyHex, 'hex'); // Convert the key from HEX to a Buffer
const iv = Buffer.from('656e6372797074696f6e496e74566563', 'hex'); // Convert the IV from HEX to a Buffer
const encryptedMessage = Buffer.from(
  '876b4e970c3516f333bcf5f16d546a87aaeea5588ead29d213557efc1903997e',
  'hex',
); // Convert the encrypted message from HEX to a Buffer
// Create a decipher object using AES-128-CBC mode
const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8'); // Decrypt the message
decrypted += decipher.final('utf8'); // Finalize the decryption

console.log('Decrypted message:', decrypted);

// Answer:

// Decrypted message: Hello Blockchain!
/*
  Task 3: Generate an asymmetric Elliptic Curve key-pair
*/
// Generate an EC key-pair using the secp256k1 curve
const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
  namedCurve: 'secp256k1', // Curve name
  publicKeyEncoding: {
    type: 'spki', // Public key format
    format: 'pem', // Public key encoding
  },
  privateKeyEncoding: {
    type: 'pkcs8', // Private key format
    format: 'pem', // Private key encoding
  },
});

console.log('Public Key:\n', publicKey);
console.log('Private Key:\n', privateKey);

// Answer:

// Public Key:
//  -----BEGIN PUBLIC KEY-----
// MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE+IT4RNXtock0hJclOERaUV1zj/gNfAHQ
// C4t7UVgtmaR7oxJ8BrGRcMsbmDS5sTph1go2NujOXmLXoEBPqi5L7A==
// -----END PUBLIC KEY-----
// Private Key:
//  -----BEGIN PRIVATE KEY-----
// MIGEAgEAMBAGByqGSM49AgEGBSuBBAAKBG0wawIBAQQgaTyj2jnICZ6iDm8LU5K/
// gKVnil1Y7/JisEnsU97g4kyhRANCAAT4hPhE1e2hyTSElyU4RFpRXXOP+A18AdAL
// i3tRWC2ZpHujEnwGsZFwyxuYNLmxOmHWCjY26M5eYtegQE+qLkvs
// -----END PRIVATE KEY-----
/*
  Task 4: Create a digital signature
*/
const sign = crypto.createSign('SHA256');
sign.update(decrypted);
sign.end();

const signature = sign.sign(privateKey, 'hex');

console.log('Digital Signature:\n', signature);

// Answer:

// Digital Signature:
// 3045022100ea33c32428700335d336a575d3b95dfef1d43b42f7c2614f6883a5ec062e28080220753f627f7cbab6493d54be75f882ff89d2b0ce2d1a1de0b2c82b592b60875ded
