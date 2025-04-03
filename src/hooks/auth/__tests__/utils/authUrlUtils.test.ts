
import { describe, it, expect } from 'vitest';
import { hasAuthParameters } from '../../utils/authUrlUtils';
import { AuthUrlInfo } from '@/types/auth';

describe('authUrlUtils', () => {
  describe('hasAuthParameters', () => {
    it('should return true if hasAuthInHash is true', () => {
      const urlInfo: AuthUrlInfo = {
        hasAuthInHash: true,
        hasAuthInSearch: false,
        hasAuthInPath: false,
        hasAuthInUrl: true,
        hasError: false,
        fullUrl: '',
        hash: '',
        search: '',
        path: ''
      };
      
      expect(hasAuthParameters(urlInfo)).toBe(true);
    });
    
    it('should return true if hasAuthInSearch is true', () => {
      const urlInfo: AuthUrlInfo = {
        hasAuthInHash: false,
        hasAuthInSearch: true,
        hasAuthInPath: false,
        hasAuthInUrl: true,
        hasError: false,
        fullUrl: '',
        hash: '',
        search: '',
        path: ''
      };
      
      expect(hasAuthParameters(urlInfo)).toBe(true);
    });
    
    it('should return true if hasAuthInPath is true', () => {
      const urlInfo: AuthUrlInfo = {
        hasAuthInHash: false,
        hasAuthInSearch: false,
        hasAuthInPath: true,
        hasAuthInUrl: true,
        hasError: false,
        fullUrl: '',
        hash: '',
        search: '',
        path: ''
      };
      
      expect(hasAuthParameters(urlInfo)).toBe(true);
    });
    
    it('should return true if hasAuthInUrl is true', () => {
      const urlInfo: AuthUrlInfo = {
        hasAuthInHash: false,
        hasAuthInSearch: false,
        hasAuthInPath: false,
        hasAuthInUrl: true,
        hasError: false,
        fullUrl: '',
        hash: '',
        search: '',
        path: ''
      };
      
      expect(hasAuthParameters(urlInfo)).toBe(true);
    });
    
    it('should return false if all auth parameters are false', () => {
      const urlInfo: AuthUrlInfo = {
        hasAuthInHash: false,
        hasAuthInSearch: false,
        hasAuthInPath: false,
        hasAuthInUrl: false,
        hasError: false,
        fullUrl: '',
        hash: '',
        search: '',
        path: ''
      };
      
      expect(hasAuthParameters(urlInfo)).toBe(false);
    });
  });
});
