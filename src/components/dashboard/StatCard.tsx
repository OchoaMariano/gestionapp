import { 
  BanknotesIcon, 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalculatorIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  type: 'income' | 'expenses' | 'taxes';
}

export function StatCard({ title, value, change, isPositive, type }: StatCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'income':
        return <BanknotesIcon className="h-8 w-8 text-green-600" />;
      case 'expenses':
        return <BuildingOfficeIcon className="h-8 w-8 text-red-600" />;
      case 'taxes':
        return <CalculatorIcon className="h-8 w-8 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
        {getIcon()}
      </div>
      {change && (
        <div className="mt-2 flex items-center">
          {isPositive ? (
            <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
          ) : (
            <ArrowTrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
          )}
          <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
          <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
        </div>
      )}
    </div>
  );
} 