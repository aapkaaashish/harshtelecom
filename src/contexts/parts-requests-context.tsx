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
}

const PartsRequestsContext = createContext<PartsRequestsContextType | undefined>(undefined);

const initialRequests: PartsRequest[] = [
  {
    id: 'PRT-12345678',
    technicianName: 'Yash',
    technicianEmail: 'yash@repairbros.in',
    partType: 'screen-iphone',
    quantity: 2,
    urgency: 'normal',
    notes: 'Need for iPhone 14 Pro repairs',
    status: 'pending',
    requestTime: '2026-05-04T19:30:00Z',
  },
  {
    id: 'PRT-87654321',
    technicianName: 'Yash',
    technicianEmail: 'yash@repairbros.in',
    partType: 'backpanel-iphone',
    quantity: 1,
    urgency: 'urgent',
    notes: 'Customer waiting, urgent repair needed',
    status: 'approved',
    requestTime: '2026-05-04T18:15:00Z',
    adminNotes: 'Approved - $45 each, available in stock',
    approvedTime: '2026-05-04T18:30:00Z',
  },
  {
    id: 'PRT-11223344',
    technicianName: 'Yash',
    technicianEmail: 'yash@repairbros.in',
    partType: 'battery',
    quantity: 3,
    urgency: 'low',
    notes: 'Regular stock replenishment',
    status: 'rejected',
    requestTime: '2026-05-04T17:00:00Z',
    adminNotes: 'Out of stock - will be available next week',
    rejectedTime: '2026-05-04T17:15:00Z',
  },
];

export function PartsRequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<PartsRequest[]>(() => {
    // Try to load from localStorage on mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('partsRequests');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved requests:', e);
        }
      }
    }
    return initialRequests;
  });

  // Save to localStorage whenever requests change
  useEffect(() => {
    if (typeof window !== 'undefined') {
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

    setRequests(prev => [request, ...prev]);
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

  return (
    <PartsRequestsContext.Provider value={{
      requests,
      addRequest,
      updateRequestStatus,
      getPendingCount,
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