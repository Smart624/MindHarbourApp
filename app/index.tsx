import { Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import Loading from '../src/components/common/Loading';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (user) {
    return <Redirect href="/(app)" />;
  }

  return <Redirect href="/login" />;
}