import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import logger from './logger.js';

const KEY_DIR= path.join(process.cwd(), 'keystore');
if (!fs.existsSync(KEY_DIR)) fs.mkdirSync(KEY_DIR,{recursive:true});


export function encryptPrivateKey(privateKey, masterKeyHex) {
    const iv = crypto.randomBytes(16);
    const key = Buffer.from(masterKeyHex, 'hex');
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(privateKey, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    const blob = Buffer.concat([iv, tag, encrypted]).toString("base64");
    return blob;
}
export function decryptPrivateKey(encryptedBlob, masterKeyHex) {
    const data = Buffer.from(blobBase64, "base64");
    const iv = data.slice(0, 12);
    const tag = data.slice(12, 28);
    const ciphertext = data.slice(28);
    const key = Buffer.from(masterKeyHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return decrypted.toString('utf8');
}
export function saveEncryptedKey(address, encryptedBlob,meta={}) {
    const obj = {
        address,
        encryptedBlob,
        meta,
        createdAt: new Date().toISOString()
    };
    const filePath = path.join(KEY_DIR, `${Date.now()}_${address}.json`);
    fs.writeFileSync(filename, JSON.stringify(obj, null, 2));
    logger.info(`Saved rotated key to ${filename}`);
    return filename;
}