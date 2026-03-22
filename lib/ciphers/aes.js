import CryptoJS from "crypto-js";

/**
 * Normalizes a hex string to a specific length based on the bit size.
 * Keys: 128 bit = 16 bytes = 32 hex chars. 192 = 48. 256 = 64.
 * IVs: Always 128 bit = 32 hex chars for AES.
 */
function normalizeHex(hexStr, targetHexLen) {
  let cleanStr = (hexStr || "").replace(/[^0-9a-fA-F]/g, "") || "".padEnd(targetHexLen, "0");
  if (cleanStr.length < targetHexLen) {
    cleanStr = cleanStr.padEnd(targetHexLen, "0");
  } else if (cleanStr.length > targetHexLen) {
    cleanStr = cleanStr.slice(0, targetHexLen);
  }
  return cleanStr;
}

/**
 * Gets the CryptoJS mode object from a string.
 */
function getCryptoMode(modeStr) {
  switch (modeStr?.toUpperCase()) {
    case "CBC": return CryptoJS.mode.CBC;
    case "CFB": return CryptoJS.mode.CFB;
    case "OFB": return CryptoJS.mode.OFB;
    case "CTR": return CryptoJS.mode.CTR;
    case "ECB":
    default:
      return CryptoJS.mode.ECB;
  }
}

/**
 * Encrypts text using AES with specified block mode and IV.
 * @param {string} text 
 * @param {string} keyHex - Variable length hex string
 * @param {Object} options - { mode: "ECB"|"CBC"..., ivHex: string, outputFormat: "hex"|"base64", keySize: 128|192|256 }
 * @returns {string}
 */
export function encryptAES(text, keyHex, options = {}) {
  if (!text) return "";
  const { mode = "ECB", ivHex = "", outputFormat = "base64", keySize = 128 } = options;
  
  const keyChars = keySize / 4;
  const keyWA = CryptoJS.enc.Hex.parse(normalizeHex(keyHex, keyChars));
  const ivWA = CryptoJS.enc.Hex.parse(normalizeHex(ivHex, 32)); // AES block size is 128 bits (32 hex)
  const cjsMode = getCryptoMode(mode);

  try {
    const encrypted = CryptoJS.AES.encrypt(text, keyWA, {
      mode: cjsMode,
      padding: CryptoJS.pad.Pkcs7,
      ...(mode !== "ECB" && { iv: ivWA })
    });
    
    return outputFormat === "hex" 
      ? encrypted.ciphertext.toString(CryptoJS.enc.Hex).toUpperCase()
      : encrypted.toString();
  } catch (e) {
    return "⚠ Encryption Error";
  }
}

/**
 * Decrypts text using AES with specified block mode and IV.
 * @param {string} text - Ciphertext (hex or base64)
 * @param {string} keyHex - Variable length hex string
 * @param {Object} options - { mode, ivHex, inputFormat, keySize }
 * @returns {string}
 */
export function decryptAES(text, keyHex, options = {}) {
  if (!text) return "";
  const { mode = "ECB", ivHex = "", inputFormat = "base64", keySize = 128 } = options;
  
  const keyChars = keySize / 4;
  const keyWA = CryptoJS.enc.Hex.parse(normalizeHex(keyHex, keyChars));
  const ivWA = CryptoJS.enc.Hex.parse(normalizeHex(ivHex, 32));
  const cjsMode = getCryptoMode(mode);

  try {
    let cipherParams;
    if (inputFormat === "hex") {
       const ciphertext = CryptoJS.enc.Hex.parse(text.replace(/[^0-9a-fA-F]/g, ""));
       cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext });
    } else {
       cipherParams = text;
    }

    const decrypted = CryptoJS.AES.decrypt(cipherParams, keyWA, {
      mode: cjsMode,
      padding: CryptoJS.pad.Pkcs7,
      ...(mode !== "ECB" && { iv: ivWA })
    });
    
    const originalText = decrypted.toString(CryptoJS.enc.Utf8);
    return originalText || "⚠ Invalid Key, Mode, or Corrupted Data";
  } catch (e) {
    return "⚠ Error Decrypting (Check Key/IV)";
  }
}

/**
 * Returns a step-by-step breakdown of the AES transformation.
 */
export function getAESSteps(text, keyHex, modeStr = "encrypt", options = {}) {
  const { blockMode = "ECB", ivHex = "", format = "base64", keySize = 128 } = options;
  
  const keyChars = keySize / 4;
  const normKey = normalizeHex(keyHex, keyChars);
  const normIV = normalizeHex(ivHex, 32);
  
  const output = modeStr === "encrypt" 
    ? encryptAES(text, normKey, { mode: blockMode, ivHex: normIV, outputFormat: format, keySize }) 
    : decryptAES(text, normKey, { mode: blockMode, ivHex: normIV, inputFormat: format, keySize });

  return [{
    type: "aes_data",
    data: {
      input: text,
      output,
      keyHex: normKey,
      ivHex: blockMode !== "ECB" ? normIV : null,
      mode: blockMode,
      keySize,
      format,
      action: modeStr
    }
  }];
}
