'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '../utils/format';

interface TransactionsChartProps {
  data: any[];
}

export default function TransactionsChart({ data }: TransactionsChartProps) {
  const processedData = data.reduce((acc: any, item: any) => {
    const month = format(new Date(item.month), 'MMM yyyy', { locale: ptBR });
    const existing = acc.find((d: any) => d.month === month);
    
    if (existing) {
      existing[item.type] = parseFloat(item.total);
    } else {
      acc.push({
        month,
        income: item.type === 'income' ? parseFloat(item.total) : 0,
        expense: item.type === 'expense' ? parseFloat(item.total) : 0,
      });
    }
    
    return acc;
  }, []).reverse();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Receitas e Despesas (Últimos 6 Meses)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `R$ ${value / 1000}k`}
          />
          <Tooltip 
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="income" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Receitas"
            dot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="expense" 
            stroke="#ef4444" 
            strokeWidth={2}
            name="Despesas"
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

