'use client';

import { useAuth } from './providers/AuthProvider';
import Dashboard from './components/Dashboard';
import Loading from './components/Loading';

export default function Home() {
  const { loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return <Dashboard />;
}

