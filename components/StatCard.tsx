interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  colorClass?: string;
}

export default function StatCard({ title, value, icon, subtitle, colorClass = 'text-brand-600' }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass} bg-current/10`}>
          <div className={colorClass}>{icon}</div>
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {subtitle && (
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      )}
    </div>
  );
}