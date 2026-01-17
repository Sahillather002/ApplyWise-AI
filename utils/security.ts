
import CryptoJS from 'crypto-js';
import DOMPurify from 'dompurify';

const SECRET_KEY = 'applywise_local_vault_key'; 

export const security = {
  /**
   * Encrypts a string using AES
   */
  encrypt: (data: string): string => {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  },

  /**
   * Decrypts an AES encrypted string
   */
  decrypt: (ciphertext: string): string => {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      if (!originalText) throw new Error("Empty decryption result");
      return originalText;
    } catch (e) {
      console.error("Decryption failed", e);
      return '';
    }
  },

  /**
   * Sanitizes HTML to prevent XSS
   */
  sanitize: (html: string): string => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: ['href', 'target', 'rel']
    });
  },

  /**
   * Simple rate limiter for client-side actions with persistence
   */
  createRateLimiter: (limit: number, interval: number) => {
    let calls: number[] = [];
    return () => {
      const now = Date.now();
      calls = calls.filter(t => now - t < interval);
      if (calls.length >= limit) {
        console.warn(`Rate limit exceeded: ${limit} calls per ${interval}ms`);
        return false;
      }
      calls.push(now);
      return true;
    };
  }
};
