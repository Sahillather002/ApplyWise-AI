
import { describe, it, expect } from 'vitest';
import { security } from '../security';

describe('Security Utilities', () => {
  describe('Encryption', () => {
    it('should encrypt and decrypt a string correctly', () => {
      const original = 'secret_data_123';
      const encrypted = security.encrypt(original);
      const decrypted = security.decrypt(encrypted);
      
      expect(encrypted).not.toBe(original);
      expect(decrypted).toBe(original);
    });

    it('should return empty string for failed decryption', () => {
      const result = security.decrypt('invalid_ciphertext');
      expect(result).toBe('');
    });
  });

  describe('Sanitization', () => {
    it('should strip malicious script tags', () => {
      const dirty = '<script>alert("xss")</script><b>Hello</b>';
      const clean = security.sanitize(dirty);
      expect(clean).not.toContain('<script>');
      expect(clean).toContain('<b>Hello</b>');
    });

    it('should preserve safe HTML tags', () => {
      const safe = '<p>This is <strong class="test">safe</strong>.</p>';
      const clean = security.sanitize(safe);
      expect(clean).toContain('<p>');
      expect(clean).toContain('<strong>');
    });
  });
});
