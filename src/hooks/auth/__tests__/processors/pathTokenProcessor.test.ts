
import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { processPathToken } from '../../processors/pathTokenProcessor';
import { AuthProcessOptions, AuthUrlInfo } from '@/types/auth';

// Mock the token utils
vi.mock('@/utils/auth/tokenUtils', () => ({
  fixAuthTokenFormat: vi.fn((path, fullUrl) => {
    if (path.includes('token-value')) {
      return 'access_token=mockToken';
    }
    return null;
  })
}));

describe('processPathToken', () => {
  // Mock window.history and window.location
  const originalReplaceState = window.history.replaceState;
  let mockSetIsProcessingAuth: ReturnType<typeof vi.fn>;
  
  beforeEach(() => {
    // Reset mocks
    window.history.replaceState = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { hash: '' },
      writable: true
    });
    mockSetIsProcessingAuth = vi.fn();
    
    // Mock setTimeout
    vi.useFakeTimers();
  });
  
  afterAll(() => {
    // Restore original implementations
    window.history.replaceState = originalReplaceState;
    vi.useRealTimers();
    vi.resetAllMocks();
  });
  
  it('should return false if there is no auth in path', async () => {
    const urlInfo: AuthUrlInfo = {
      hasAuthInPath: false,
      hasAuthInHash: false,
      hasAuthInSearch: false,
      hasAuthInUrl: false,
      hasError: false,
      fullUrl: 'https://example.com',
      path: '/some-path',
      hash: '',
      search: ''
    };
    
    const options: AuthProcessOptions = {
      setIsProcessingAuth: mockSetIsProcessingAuth
    };
    
    const result = await processPathToken(urlInfo, options);
    expect(result).toBe(false);
    expect(window.history.replaceState).not.toHaveBeenCalled();
  });
  
  it('should process token in path and update URL', async () => {
    const urlInfo: AuthUrlInfo = {
      hasAuthInPath: true,
      hasAuthInHash: false,
      hasAuthInSearch: false,
      hasAuthInUrl: true,
      hasError: false,
      fullUrl: 'https://example.com/token-value',
      path: '/token-value',
      hash: '',
      search: ''
    };
    
    const options: AuthProcessOptions = {
      setIsProcessingAuth: mockSetIsProcessingAuth
    };
    
    const result = await processPathToken(urlInfo, options);
    
    // Advance timers to process the setTimeout
    vi.advanceTimersByTime(300);
    
    expect(window.history.replaceState).toHaveBeenCalledWith(
      null, 
      document.title,
      '/acesso-plano#access_token=mockToken'
    );
    expect(window.location.hash).toBe('access_token=mockToken');
    expect(result).toBe(true);
  });
  
  it('should return false if token format cannot be fixed', async () => {
    const urlInfo: AuthUrlInfo = {
      hasAuthInPath: true,
      hasAuthInHash: false,
      hasAuthInSearch: false,
      hasAuthInUrl: true,
      hasError: false,
      fullUrl: 'https://example.com/invalid-path',
      path: '/invalid-path',
      hash: '',
      search: ''
    };
    
    const options: AuthProcessOptions = {
      setIsProcessingAuth: mockSetIsProcessingAuth
    };
    
    const result = await processPathToken(urlInfo, options);
    expect(result).toBe(false);
    expect(window.history.replaceState).not.toHaveBeenCalled();
  });
});
