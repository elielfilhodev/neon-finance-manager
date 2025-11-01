'use client';

import { TrendingUp, TrendingDown, DollarSign, ArrowUpDown } from 'lucide-react';
import { formatCurrency } from '../utils/format';

interface StatsCardsProps {
  stats: {
    income: number;
    expenses: number;
    balance: number;
    transactionsCount: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Receitas',
      value: stats.income,
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Despesas',
      value: stats.expenses,
      icon: TrendingDown,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Saldo',
      value: stats.balance,
      icon: DollarSign,
      color: stats.balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400',
      bgColor: stats.balance >= 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Transações',
      value: stats.transactionsCount,
      icon: ArrowUpDown,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {card.title}
                </p>
                <p className={`text-2xl font-bold mt-2 ${card.color}`}>
                  {typeof card.value === 'number' && card.title !== 'Transações'
                    ? formatCurrency(card.value)
                    : card.value}
                </p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <Icon className={card.color} size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

