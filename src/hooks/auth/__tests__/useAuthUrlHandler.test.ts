
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuthUrlHandler } from '@/hooks/useAuthUrlHandler';

// Mock dependencies
vi.mock('@/hooks/auth/processors/pathTokenProcessor', () => ({
  processPathToken: vi.fn()
}));

vi.mock('@/hooks/auth/processors/errorProcessor', () => ({
  processAuthError: vi.fn()
}));

vi.mock('@/hooks/auth/utils/authUrlUtils', () => ({
  hasAuthParameters: vi.fn()
}));

vi.mock('@/hooks/auth/useAuthUrlDetection', () => ({
  useAuthUrlDetection: vi.fn(() => ({
    hasAuthInHash: false,
    hasAuthInSearch: false,
    hasAuthInPath: false,
    hasAuthInUrl: false,
    hasError: false,
    fullUrl: 'https://example.com',
    hash: '',
    search: '',
    path: ''
  }))
}));

describe('useAuthUrlHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should initialize with isProcessingAuth=false', () => {
    const { result } = renderHook(() => useAuthUrlHandler());
    
    expect(result.current.isProcessingAuth).toBe(false);
  });
  
  it('should call processors in useEffect when hasAuthParameters is true', async () => {
    // Setup mocks
    const { hasAuthParameters } = require('@/hooks/auth/utils/authUrlUtils');
    const { processPathToken } = require('@/hooks/auth/processors/pathTokenProcessor');
    const { processAuthError } = require('@/hooks/auth/processors/errorProcessor');
    
    // Make hasAuthParameters return true
    (hasAuthParameters as any).mockReturnValue(true);
    
    // Make processors return false (not processed)
    (processPathToken as any).mockResolvedValue(false);
    (processAuthError as any).mockResolvedValue(false);
    
    // Use act when working with hooks
    // For React 18+, waitFor is often needed for async operations
    const { result, rerender } = renderHook(() => useAuthUrlHandler());
    
    // Wait for the effect to run
    await vi.runAllTimersAsync();
    
    // Verify the processors were called
    expect(processPathToken).toHaveBeenCalled();
    expect(processAuthError).toHaveBeenCalled();
    
    // isProcessingAuth should be false since neither processor "processed" the URL
    expect(result.current.isProcessingAuth).toBe(false);
  });
  
  it('should set isProcessingAuth=true when a processor returns true', async () => {
    // Setup mocks
    const { hasAuthParameters } = require('@/hooks/auth/utils/authUrlUtils');
    const { processPathToken } = require('@/hooks/auth/processors/pathTokenProcessor');
    
    // Make hasAuthParameters return true
    (hasAuthParameters as any).mockReturnValue(true);
    
    // Make pathTokenProcessor return true (processed)
    (processPathToken as any).mockResolvedValue(true);
    
    const { result, rerender } = renderHook(() => useAuthUrlHandler());
    
    // Wait for the effect to run
    await vi.runAllTimersAsync();
    
    // isProcessingAuth should be true since pathTokenProcessor returned true
    expect(result.current.isProcessingAuth).toBe(true);
  });
  
  it('should not call processors when hasAuthParameters is false', async () => {
    // Setup mocks
    const { hasAuthParameters } = require('@/hooks/auth/utils/authUrlUtils');
    const { processPathToken } = require('@/hooks/auth/processors/pathTokenProcessor');
    const { processAuthError } = require('@/hooks/auth/processors/errorProcessor');
    
    // Make hasAuthParameters return false
    (hasAuthParameters as any).mockReturnValue(false);
    
    renderHook(() => useAuthUrlHandler());
    
    // Wait a tick to ensure effects have run
    await vi.runAllTimersAsync();
    
    // Verify the processors were not called
    expect(processPathToken).not.toHaveBeenCalled();
    expect(processAuthError).not.toHaveBeenCalled();
  });
});
