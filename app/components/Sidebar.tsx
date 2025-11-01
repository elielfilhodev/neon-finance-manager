'use client';

import { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  LogOut, 
  User, 
  Menu, 
  X,
  Plus,
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import TransactionModal from './TransactionModal';

export default function Sidebar({ onTransactionCreated }: { onTransactionCreated: () => void }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg text-gray-700 dark:text-gray-300"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              Finance Manager
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Gestão Financeira
            </p>
          </div>

          <nav className="flex-1 space-y-2">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Home className="mr-3" size={20} />
              Dashboard
            </button>

            <button
              onClick={() => {
                setShowModal(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center px-4 py-3 text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
            >
              <Plus className="mr-3" size={20} />
              Nova Transação
            </button>
          </nav>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center px-4 py-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <User className="text-primary-600 dark:text-primary-400" size={20} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="mr-3" size={20} />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {showModal && (
        <TransactionModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            onTransactionCreated();
          }}
        />
      )}
    </>
  );
}

