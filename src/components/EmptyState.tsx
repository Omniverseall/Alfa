interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
}

const EmptyState = ({ message, icon }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default EmptyState;