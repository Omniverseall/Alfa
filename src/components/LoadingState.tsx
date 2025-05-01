import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = "Загрузка..." }: LoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[200px]">
      <Loader2 className="h-8 w-8 animate-spin text-brand-blue mb-2" />
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default LoadingState;