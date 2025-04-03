
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processAuthError } from '../../processors/errorProcessor';
import { AuthProcessOptions, AuthUrlInfo } from '@/types/auth';

// Mock dependencies
vi.mock('@/utils/auth/tokenUtils', () => ({
  handleAuthError: vi.fn((hash, search) => {
    if (hash.includes('error=') || search.includes('error=')) {
      return 'Authentication failed';
    }
    return null;
  }),
  cleanUrlAfterAuth: vi.fn()
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn()
  }
}));

describe('processAuthError', () => {
  let mockSetIsProcessingAuth: ReturnType<typeof vi.fn>;
  
  beforeEach(() => {
    // Reset mocks
    mockSetIsProcessingAuth = vi.fn();
    vi.clearAllMocks();
  });
  
  it('should return false if there is no error', async () => {
    const urlInfo: AuthUrlInfo = {
      hasAuthInPath: false,
      hasAuthInHash: true,
      hasAuthInSearch: false,
      hasAuthInUrl: true,
      hasError: false,
      fullUrl: 'https://example.com#access_token=valid_token',
      path: '',
      hash: '#access_token=valid_token',
      search: ''
    };
    
    const options: AuthProcessOptions = {
      setIsProcessingAuth: mockSetIsProcessingAuth
    };
    
    const result = await processAuthError(urlInfo, options);
    expect(result).toBe(false);
    expect(mockSetIsProcessingAuth).not.toHaveBeenCalled();
  });
  
  it('should process error in hash and show toast', async () => {
    const urlInfo: AuthUrlInfo = {
      hasAuthInPath: false,
      hasAuthInHash: true,
      hasAuthInSearch: false,
      hasAuthInUrl: true,
      hasError: true,
      fullUrl: 'https://example.com#error=invalid_request',
      path: '',
      hash: '#error=invalid_request',
      search: ''
    };
    
    const options: AuthProcessOptions = {
      setIsProcessingAuth: mockSetIsProcessingAuth
    };
    
    const { handleAuthError, cleanUrlAfterAuth } = await import('@/utils/auth/tokenUtils');
    const { toast } = await import('sonner');
    
    const result = await processAuthError(urlInfo, options);
    
    expect(result).toBe(true);
    expect(handleAuthError).toHaveBeenCalledWith('#error=invalid_request', '');
    expect(toast.error).toHaveBeenCalledWith('Erro na autenticação: Authentication failed');
    expect(mockSetIsProcessingAuth).toHaveBeenCalledWith(false);
    expect(cleanUrlAfterAuth).toHaveBeenCalled();
  });
  
  it('should process error in search params and show toast', async () => {
    const urlInfo: AuthUrlInfo = {
      hasAuthInPath: false,
      hasAuthInHash: false,
      hasAuthInSearch: true,
      hasAuthInUrl: true,
      hasError: true,
      fullUrl: 'https://example.com?error=invalid_request',
      path: '',
      hash: '',
      search: '?error=invalid_request'
    };
    
    const options: AuthProcessOptions = {
      setIsProcessingAuth: mockSetIsProcessingAuth
    };
    
    const { handleAuthError, cleanUrlAfterAuth } = await import('@/utils/auth/tokenUtils');
    const { toast } = await import('sonner');
    
    const result = await processAuthError(urlInfo, options);
    
    expect(result).toBe(true);
    expect(handleAuthError).toHaveBeenCalledWith('', '?error=invalid_request');
    expect(toast.error).toHaveBeenCalledWith('Erro na autenticação: Authentication failed');
    expect(mockSetIsProcessingAuth).toHaveBeenCalledWith(false);
    expect(cleanUrlAfterAuth).toHaveBeenCalled();
  });
  
  it('should show default error message if handleAuthError returns null', async () => {
    const urlInfo: AuthUrlInfo = {
      hasAuthInPath: false,
      hasAuthInHash: false,
      hasAuthInSearch: false,
      hasAuthInUrl: true,
      hasError: true,
      fullUrl: 'https://example.com',
      path: '',
      hash: '',
      search: ''
    };
    
    const options: AuthProcessOptions = {
      setIsProcessingAuth: mockSetIsProcessingAuth
    };
    
    const { handleAuthError } = await import('@/utils/auth/tokenUtils');
    const { toast } = await import('sonner');
    
    // Override mock for this test case
    (handleAuthError as any).mockReturnValueOnce(null);
    
    const result = await processAuthError(urlInfo, options);
    
    expect(result).toBe(true);
    expect(toast.error).toHaveBeenCalledWith('Erro na autenticação: Erro desconhecido na autenticação');
  });
});
