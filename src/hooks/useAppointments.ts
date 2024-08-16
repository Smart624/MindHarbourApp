import { useState, useEffect } from 'react';
import { getAppointments } from '../services/firestore';
import { Appointment } from '../types/appointment';
import { useAuth } from '../context/AuthContext';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      if (user) {
        try {
          const fetchedAppointments = await getAppointments(user.id, user.userType);
          setAppointments(fetchedAppointments);
        } catch (err) {
          setError('Failed to fetch appointments');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAppointments();
  }, [user]);

  return { appointments, loading, error };
};