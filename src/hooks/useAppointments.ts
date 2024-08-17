import { useState, useEffect } from 'react';
import { getAppointments } from '../services/firestore';
import { Appointment } from '../types/appointment';
import { useGlobalAuthState } from '../globalAuthState';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useGlobalAuthState();

  useEffect(() => {
    const fetchAppointments = async () => {
      console.log('Current user in useAppointments:', user);
      if (user && user.uid && user.userType) {
        try {
          console.log('Fetching appointments for user:', user.uid);
          const fetchedAppointments = await getAppointments(user.uid, user.userType);
          console.log('Fetched appointments:', fetchedAppointments);
          setAppointments(fetchedAppointments);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching appointments:', err);
          setError('Failed to fetch appointments');
          setLoading(false);
        }
      } else {
        console.log('No valid user found, setting loading to false');
        setLoading(false);
        setError('No valid user found');
      }
    };

    fetchAppointments();
  }, [user]);

  return { appointments, loading, error };
};