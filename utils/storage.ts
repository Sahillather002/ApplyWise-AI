
import { security } from './security';

export const encryptedStorage = {
  setItem: (key: string, value: any) => {
    const stringValue = JSON.stringify(value);
    const encrypted = security.encrypt(stringValue);
    localStorage.setItem(key, encrypted);
  },

  getItem: <T>(key: string): T | null => {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    const decrypted = security.decrypt(encrypted);
    try {
      return JSON.parse(decrypted) as T;
    } catch (e) {
      console.error(`Failed to parse storage item: ${key}`, e);
      return null;
    }
  },

  removeItem: (key: string) => {
    localStorage.removeItem(key);
  }
};
