'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PartsRequest {
  id: string;
  technicianName: string;
  technicianEmail: string;
  partType: string;
  quantity: number;
  urgency: 'low' | 'normal' | 'urgent';
  notes: string;
  status: 'pending' | 'approved' | 'rejected' | 'delivered';
  requestTime: string;
  adminNotes?: string;
  approvedTime?: string;
  rejectedTime?: string;
}

interface PartsRequestsContextType {
  requests: PartsRequest[];
  addRequest: (request: Omit<PartsRequest, 'id' | 'status' | 'requestTime'>) => void;
  updateRequestStatus: (id: string, status: PartsRequest['status'], adminNotes?: string) => void;
  getPendingCount: () => number;
  clearAllRequests: () => void;
}

const PartsRequestsContext = createContext<PartsRequestsContextType | undefined>(undefined);

// Initial mock data - will be replaced by real submissions
const initialRequests: PartsRequest[] = [];

export function PartsRequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<PartsRequest[]>(() => {
    // Try to load from localStorage on mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('partsRequests');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          console.log('Loaded parts requests from localStorage:', parsed);
          return parsed;
        } catch (e) {
          console.error('Failed to parse saved requests:', e);
        }
      }
    }
    console.log('Using initial empty requests array');
    return initialRequests;
  });

  // Save to localStorage whenever requests change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Saving requests to localStorage:', requests);
      localStorage.setItem('partsRequests', JSON.stringify(requests));
    }
  }, [requests]);

  const addRequest = (newRequest: Omit<PartsRequest, 'id' | 'status' | 'requestTime'>) => {
    const request: PartsRequest = {
      ...newRequest,
      id: 'PRT-' + Date.now().toString().slice(-8),
      status: 'pending',
      requestTime: new Date().toISOString(),
    };

    console.log('Adding new parts request:', request);
    setRequests(prev => {
      const newRequests = [request, ...prev];
      console.log('Updated requests array:', newRequests);
      return newRequests;
    });
  };

  const updateRequestStatus = (id: string, status: PartsRequest['status'], adminNotes?: string) => {
    setRequests(prev => prev.map(request => {
      if (request.id === id) {
        const update: Partial<PartsRequest> = {
          status,
          adminNotes,
        };

        if (status === 'approved') {
          update.approvedTime = new Date().toISOString();
        } else if (status === 'rejected') {
          update.rejectedTime = new Date().toISOString();
        }

        return { ...request, ...update };
      }
      return request;
    }));
  };

  const getPendingCount = () => {
    return requests.filter(r => r.status === 'pending').length;
  };

  const clearAllRequests = () => {
    console.log('Clearing all requests');
    setRequests([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('partsRequests');
    }
  };

  return (
    <PartsRequestsContext.Provider value={{
      requests,
      addRequest,
      updateRequestStatus,
      getPendingCount,
      clearAllRequests,
    }}>
      {children}
    </PartsRequestsContext.Provider>
  );
}

export function usePartsRequests() {
  const context = useContext(PartsRequestsContext);
  if (context === undefined) {
    throw new Error('usePartsRequests must be used within a PartsRequestsProvider');
  }
  return context;
}