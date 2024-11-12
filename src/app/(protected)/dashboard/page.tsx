'use client';

import { useEffect, useState } from 'react';
import { format, subMonths, startOfYear, endOfYear } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { StatCard } from '@/components/dashboard/StatCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { ChartBarIcon, ChartPieIcon, TableCellsIcon } from '@heroicons/react/24/outline';

interface DashboardData {
  stats: {
    totalIncome: number;
    totalExpenses: number;
    totalTaxes: number;
    incomeChange: number;
  };
  monthlyData: {
    month: string;
    income: number;
    expenses: number;
    taxes: number;
  }[];
  expensesByCategory: {
    category: string;
    amount: number;
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [paymentsRes, expensesRes, taxesRes] = await Promise.all([
        fetch('/api/payments'),
        fetch('/api/expenses'),
        fetch('/api/taxes')
      ]);

      const [payments, expenses, taxes] = await Promise.all([
        paymentsRes.json(),
        expensesRes.json(),
        taxesRes.json()
      ]);

      const dashboardData = processData(payments, expenses, taxes);
      setData(dashboardData);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const processData = (payments: any[], expenses: any[], taxes: any[]) => {
    const currentYear = new Date().getFullYear();
    const startDate = startOfYear(new Date());
    const endDate = endOfYear(new Date());

    // Filtrar datos del año actual
    const yearPayments = payments.filter(p => 
      new Date(p.date) >= startDate && new Date(p.date) <= endDate
    );
    const yearExpenses = expenses.filter(e => 
      new Date(e.date) >= startDate && new Date(e.date) <= endDate
    );
    const yearTaxes = taxes.filter(t => 
      new Date(t.dueDate) >= startDate && new Date(t.dueDate) <= endDate
    );

    // Calcular totales
    const totalIncome = yearPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalExpenses = yearExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalTaxes = yearTaxes.reduce((sum, t) => sum + t.amount, 0);

    // Calcular cambio mensual en ingresos
    const currentMonth = new Date();
    const lastMonth = subMonths(currentMonth, 1);
    
    const currentMonthIncome = payments
      .filter(p => new Date(p.date).getMonth() === currentMonth.getMonth())
      .reduce((sum, p) => sum + p.amount, 0);
    
    const lastMonthIncome = payments
      .filter(p => new Date(p.date).getMonth() === lastMonth.getMonth())
      .reduce((sum, p) => sum + p.amount, 0);

    const incomeChange = ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100;

    // Preparar datos mensuales
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = format(new Date(currentYear, i), 'MMM', { locale: es });
      return {
        month,
        income: 0,
        expenses: 0,
        taxes: 0,
      };
    });

    // Actualizar datos mensuales
    yearPayments.forEach(payment => {
      const monthIndex = new Date(payment.date).getMonth();
      monthlyData[monthIndex].income += payment.amount;
    });

    yearExpenses.forEach(expense => {
      const monthIndex = new Date(expense.date).getMonth();
      monthlyData[monthIndex].expenses += expense.amount;
    });

    yearTaxes.forEach(tax => {
      const monthIndex = new Date(tax.dueDate).getMonth();
      monthlyData[monthIndex].taxes += tax.amount;
    });

    // Agrupar gastos por categoría
    const expensesByCategory = expenses.reduce((acc: any[], expense) => {
      const existing = acc.find(e => e.category === expense.category);
      if (existing) {
        existing.amount += expense.amount;
      } else {
        acc.push({ category: expense.category, amount: expense.amount });
      }
      return acc;
    }, []);

    return {
      stats: {
        totalIncome,
        totalExpenses,
        totalTaxes,
        incomeChange,
      },
      monthlyData,
      expensesByCategory,
    };
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="mt-4 sm:mt-0">
          <span className="text-sm text-gray-500">
            Actualizado: {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Ingresos Totales"
          value={`$${data.stats.totalIncome.toLocaleString()}`}
          change={`${Math.abs(data.stats.incomeChange).toFixed(1)}%`}
          isPositive={data.stats.incomeChange > 0}
          type="income"
        />
        <StatCard
          title="Gastos Totales"
          value={`$${data.stats.totalExpenses.toLocaleString()}`}
          type="expenses"
        />
        <StatCard
          title="Impuestos Totales"
          value={`$${data.stats.totalTaxes.toLocaleString()}`}
          type="taxes"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard 
          title={
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="h-5 w-5 text-gray-500" />
              <span>Evolución Mensual</span>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" name="Ingresos" fill="#0088FE" />
              <Bar dataKey="expenses" name="Gastos" fill="#00C49F" />
              <Bar dataKey="taxes" name="Impuestos" fill="#FFBB28" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard 
          title={
            <div className="flex items-center space-x-2">
              <ChartPieIcon className="h-5 w-5 text-gray-500" />
              <span>Gastos por Categoría</span>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.expensesByCategory}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.expensesByCategory.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Tabla de Resumen */}
      <div className="mt-8">
        <div className="flex items-center space-x-2 mb-4">
          <TableCellsIcon className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-medium text-gray-900">Resumen del Período</h2>
        </div>
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingresos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gastos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impuestos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.monthlyData.map((month) => (
                <tr key={month.month}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {month.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${month.income.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${month.expenses.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${month.taxes.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`${
                      month.income - month.expenses - month.taxes > 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      ${(month.income - month.expenses - month.taxes).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 