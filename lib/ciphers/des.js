import CryptoJS from "crypto-js";

/**
 * Normalizes a hex string to exactly 16 characters (64 bits).
 */
function normalizeHex(hexStr) {
  let cleanStr = hexStr.replace(/[^0-9a-fA-F]/g, "") || "0000000000000000";
  if (cleanStr.length < 16) {
    cleanStr = cleanStr.padEnd(16, "0");
  } else if (cleanStr.length > 16) {
    cleanStr = cleanStr.slice(0, 16);
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
 * Encrypts text using DES with specified block mode and IV.
 * @param {string} text 
 * @param {string} keyHex - 16 character hex string
 * @param {Object} options - { mode: "ECB"|"CBC"..., ivHex: string, outputFormat: "hex"|"base64" }
 * @returns {string}
 */
export function encryptDES(text, keyHex, options = {}) {
  if (!text) return "";
  const { mode = "ECB", ivHex = "", outputFormat = "base64" } = options;
  
  const keyWA = CryptoJS.enc.Hex.parse(normalizeHex(keyHex));
  const ivWA = CryptoJS.enc.Hex.parse(normalizeHex(ivHex));
  const cjsMode = getCryptoMode(mode);

  try {
    const encrypted = CryptoJS.DES.encrypt(text, keyWA, {
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
 * Decrypts text using DES with specified block mode and IV.
 * @param {string} text - Ciphertext (hex or base64)
 * @param {string} keyHex - 16 character hex string
 * @param {Object} options - { mode: "ECB"|"CBC"..., ivHex: string, inputFormat: "hex"|"base64" }
 * @returns {string}
 */
export function decryptDES(text, keyHex, options = {}) {
  if (!text) return "";
  const { mode = "ECB", ivHex = "", inputFormat = "base64" } = options;
  
  const keyWA = CryptoJS.enc.Hex.parse(normalizeHex(keyHex));
  const ivWA = CryptoJS.enc.Hex.parse(normalizeHex(ivHex));
  const cjsMode = getCryptoMode(mode);

  try {
    let cipherParams;
    if (inputFormat === "hex") {
       // Convert hex string to CipherParams object
       const ciphertext = CryptoJS.enc.Hex.parse(text.replace(/[^0-9a-fA-F]/g, ""));
       cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext });
    } else {
       cipherParams = text;
    }

    const decrypted = CryptoJS.DES.decrypt(cipherParams, keyWA, {
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
 * Returns a step-by-step breakdown of the DES transformation.
 */
export function getDESSteps(text, keyHex, modeStr = "encrypt", options = {}) {
  const { blockMode = "ECB", ivHex = "", format = "base64" } = options;
  
  const normKey = normalizeHex(keyHex);
  const normIV = normalizeHex(ivHex);
  const output = modeStr === "encrypt" 
    ? encryptDES(text, normKey, { mode: blockMode, ivHex: normIV, outputFormat: format }) 
    : decryptDES(text, normKey, { mode: blockMode, ivHex: normIV, inputFormat: format });

  return [{
    type: "des_data",
    data: {
      input: text,
      output,
      keyHex: normKey,
      ivHex: blockMode !== "ECB" ? normIV : null,
      mode: blockMode,
      format,
      action: modeStr
    }
  }];
}
