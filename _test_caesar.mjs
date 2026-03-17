import { encryptCaesar, decryptCaesar, getCaesarSteps } from './lib/ciphers/caesar.js';

const enc = encryptCaesar('HELLO', 3);
const dec = decryptCaesar(enc, 3);
const stepsEnc = getCaesarSteps('HELLO', 3, 'encrypt');
const stepsDec = getCaesarSteps('KHOOR', 3, 'decrypt');
const mixed = getCaesarSteps('Hello, World!', 13, 'encrypt');

console.log('encrypt HELLO +3:', enc);                       // KHOOR
console.log('decrypt KHOOR -3:', dec);                      // HELLO

console.log('\n--- Encrypt steps for HELLO+3 ---');
stepsEnc.forEach(s => console.log(s.input, '->', s.output, '|', s.formula));

console.log('\n--- Decrypt steps for KHOOR-3 ---');
stepsDec.forEach(s => console.log(s.input, '->', s.output, '|', s.formula));

console.log('\n--- Mixed input ROT13 ---');
mixed.forEach(s => console.log(s.input, '->', s.output, s.type));
