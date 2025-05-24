import React from "react";

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode; // React.ReactNode для возможности передавать JSX иконки
}

const EmptyState = ({ message, icon }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      {icon && <div className="mb-4 text-gray-400 flex justify-center items-center text-6xl">{icon}</div>} {/* Добавлены классы для центрирования и размера иконки */}
      <p className="text-gray-500 text-lg">{message}</p> {/* Немного увеличен текст */}
    </div>
  );
};

export default EmptyState;