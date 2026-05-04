'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

export interface PartsRequest {
  id: string;
  technicianName: string;
  technicianEmail: string;
  partType: string;
  quantity: number;
  urgency: string;
  notes?: string;
  status: string;
  requestTime: string;
  adminNotes?: string;
  approvedTime?: string;
  rejectedTime?: string;
}

interface PartsRequestsContextType {
  requests: PartsRequest[];
  loading: boolean;
  addRequest: (request: Omit<PartsRequest, 'id' | 'status' | 'requestTime'>) => Promise<PartsRequest | undefined>;
  updateRequestStatus: (id: string, status: PartsRequest['status'], adminNotes?: string) => Promise<void>;
  getPendingCount: () => number;
  clearAllRequests: () => Promise<void>;
  refreshRequests: () => Promise<void>;
}

const PartsRequestsContext = createContext<PartsRequestsContextType | undefined>(undefined);

// Removed initial mock data - now using API

export function PartsRequestsProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [requests, setRequests] = useState<PartsRequest[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch requests from API
  const fetchRequests = useCallback(async () => {
    if (!session) return;

    try {
      setLoading(true);
      const response = await fetch('/api/requests');
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        console.error('Failed to fetch requests');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Fetch on session change
  useEffect(() => {
    if (status === 'authenticated') {
      fetchRequests();
    }
  }, [status, fetchRequests]);

  // Polling for real-time updates (every 5 seconds)
  useEffect(() => {
    if (status !== 'authenticated') return;

    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, [status, fetchRequests]);

  const addRequest = async (newRequest: Omit<PartsRequest, 'id' | 'status' | 'requestTime'>) => {
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRequest),
      });

      if (response.ok) {
        const createdRequest = await response.json();
        setRequests(prev => [createdRequest, ...prev]);
        return createdRequest;
      } else {
        console.error('Failed to create request');
        throw new Error('Failed to create request');
      }
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }
  };

  const updateRequestStatus = async (id: string, status: PartsRequest['status'], adminNotes?: string) => {
    try {
      const response = await fetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, adminNotes }),
      });

      if (response.ok) {
        const updatedRequest = await response.json();
        setRequests(prev => prev.map(request =>
          request.id === id ? updatedRequest : request
        ));
      } else {
        console.error('Failed to update request status');
      }
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const getPendingCount = () => {
    return requests.filter(r => r.status === 'pending').length;
  };

  const clearAllRequests = async () => {
    // For admin only - delete all requests
    try {
      const deletePromises = requests.map(request =>
        fetch(`/api/requests/${request.id}`, { method: 'DELETE' })
      );
      await Promise.all(deletePromises);
      setRequests([]);
    } catch (error) {
      console.error('Error clearing requests:', error);
      // Fallback to local clear
      setRequests([]);
    }
  };

  return (
    <PartsRequestsContext.Provider value={{
      requests,
      loading,
      addRequest,
      updateRequestStatus,
      getPendingCount,
      clearAllRequests,
      refreshRequests: fetchRequests,
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