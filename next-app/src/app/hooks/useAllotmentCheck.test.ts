import { renderHook, act } from '@testing-library/react';
import { useAllotmentCheck } from './useAllotmentCheck';

// Mock fetch
global.fetch = jest.fn();

describe('useAllotmentCheck', () => {
  const mockIPO = {
    id: 'test-ipo-1',
    companyName: 'Test Company',
    status: 'listed',
    allotmentDate: '2023-10-15',
    listingDate: '2023-10-20',
    lotSize: 10
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAllotmentCheck({ ipoData: mockIPO }));
    
    expect(result.current.searchMethod).toBe('pan');
    expect(result.current.applicationNumber).toBe('');
    expect(result.current.pan).toBe('');
    expect(result.current.dpId).toBe('');
    expect(result.current.clientId).toBe('');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.allotmentResult).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should change search method correctly', () => {
    const { result } = renderHook(() => useAllotmentCheck({ ipoData: mockIPO }));
    
    act(() => {
      result.current.handleSearchMethodChange('application');
    });
    
    expect(result.current.searchMethod).toBe('application');
    expect(result.current.error).toBeNull();
  });

  it('should update form values correctly', () => {
    const { result } = renderHook(() => useAllotmentCheck({ ipoData: mockIPO }));
    
    act(() => {
      result.current.setPan('ABCDE1234F');
    });
    
    expect(result.current.pan).toBe('ABCDE1234F');
    
    act(() => {
      result.current.setApplicationNumber('APP123456');
    });
    
    expect(result.current.applicationNumber).toBe('APP123456');
    
    act(() => {
      result.current.setDpId('DP123');
      result.current.setClientId('CL456');
    });
    
    expect(result.current.dpId).toBe('DP123');
    expect(result.current.clientId).toBe('CL456');
  });

  it('should reset the form correctly', () => {
    const { result } = renderHook(() => useAllotmentCheck({ ipoData: mockIPO }));
    
    act(() => {
      result.current.setPan('ABCDE1234F');
      result.current.setAllotmentResult({
        status: 'success',
        pan: 'ABCDE1234F',
        applicationNumber: 'APP123456',
        category: 'RII'
      });
      result.current.resetForm();
    });
    
    expect(result.current.pan).toBe('');
    expect(result.current.allotmentResult).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should handle successful allotment check with PAN', async () => {
    const mockResponse = {
      status: 'success',
      pan: 'ABCDE1234F',
      applicationNumber: 'APP123456',
      category: 'RII',
      bidDetails: [{ bidPrice: 1000, quantity: 100, allotted: 50 }]
    };
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const { result } = renderHook(() => useAllotmentCheck({ ipoData: mockIPO }));
    
    act(() => {
      result.current.setPan('ABCDE1234F');
    });
    
    await act(async () => {
      const event = { preventDefault: jest.fn() } as unknown as React.FormEvent;
      await result.current.handleSubmit(event);
    });
    
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/ipo/allotment?ipoId=test-ipo-1&method=pan&pan=ABCDE1234F'
    );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.allotmentResult).toEqual(mockResponse);
    expect(result.current.error).toBeNull();
  });

  it('should handle failed allotment check', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API error'));

    const { result } = renderHook(() => useAllotmentCheck({ ipoData: mockIPO }));
    
    act(() => {
      result.current.setPan('ABCDE1234F');
    });
    
    await act(async () => {
      const event = { preventDefault: jest.fn() } as unknown as React.FormEvent;
      await result.current.handleSubmit(event);
    });
    
    expect(global.fetch).toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.allotmentResult).toBeNull();
    expect(result.current.error).toBe('Failed to check allotment status. Please try again later.');
  });

  it('should validate empty inputs', async () => {
    const { result } = renderHook(() => useAllotmentCheck({ ipoData: mockIPO }));
    
    await act(async () => {
      const event = { preventDefault: jest.fn() } as unknown as React.FormEvent;
      await result.current.handleSubmit(event);
    });
    
    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.current.error).toBe('Please enter a valid PAN number');
  });

  it('should handle demat search method validation', async () => {
    const { result } = renderHook(() => useAllotmentCheck({ ipoData: mockIPO }));
    
    act(() => {
      result.current.handleSearchMethodChange('demat');
      result.current.setDpId('DP123');
      // No client ID set
    });
    
    await act(async () => {
      const event = { preventDefault: jest.fn() } as unknown as React.FormEvent;
      await result.current.handleSubmit(event);
    });
    
    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.current.error).toBe('Please enter both DP ID and Client ID');
  });
}); 