interface PageHeaderProps {
  title: string;
  description?: string;
  count?: number;
  children?: React.ReactNode;
}

export default function PageHeader({ title, description, count, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
        {description && (
          <p className="text-gray-500 mt-1">
            {description}
            {count !== undefined && (
              <span className="ml-2 text-gray-400">({count} total)</span>
            )}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}