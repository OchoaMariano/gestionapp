interface ChartCardProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {title}
      </h3>
      <div className="h-[300px]">
        {children}
      </div>
    </div>
  );
} 