import { useState, useEffect, useCallback } from 'react';
import { getAppointments } from '../services/firestore';
import { Appointment } from '../types/appointment';
import { useGlobalAuthState } from '../globalAuthState';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useGlobalAuthState();

  const fetchAppointments = useCallback(async () => {
    if (user && user.uid && user.userType) {
      try {
        setLoading(true);
        const fetchedAppointments = await getAppointments(user.uid, user.userType);
        setAppointments(fetchedAppointments);
        setError(null);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError('No valid user found');
    }
  }, [user]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return { appointments, loading, error, refetchAppointments: fetchAppointments };
};