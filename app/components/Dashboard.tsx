'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import StatsCards from './StatsCards';
import TransactionsList from './TransactionsList';
import TransactionsChart from './TransactionsChart';
import CategoryChart from './CategoryChart';
import TransactionModal from './TransactionModal';
import Sidebar from './Sidebar';

interface DashboardStats {
  income: number;
  expenses: number;
  balance: number;
  transactionsCount: number;
  byCategory: any[];
  monthly: any[];
}

export default function Dashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token, refreshKey]);

  const handleTransactionCreated = () => {
    setShowModal(false);
    setRefreshKey((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar onTransactionCreated={handleTransactionCreated} />
      
      <div className="flex-1 lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Olá, {user?.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Bem-vindo ao seu dashboard financeiro
            </p>
          </div>

          {stats && (
            <>
              <StatsCards stats={stats} />
              
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TransactionsChart data={stats.monthly} />
                <CategoryChart data={stats.byCategory} />
              </div>

              <div className="mt-6">
                <TransactionsList onTransactionUpdated={() => setRefreshKey((prev) => prev + 1)} />
              </div>
            </>
          )}
        </div>
      </div>

      {showModal && (
        <TransactionModal
          onClose={() => setShowModal(false)}
          onSuccess={handleTransactionCreated}
        />
      )}
    </div>
  );
}

