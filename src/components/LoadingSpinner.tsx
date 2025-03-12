import { SyncLoader } from "react-spinners";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  loading?: boolean;
}

export default function LoadingSpinner({
  size = 15,
  color = "#3b82f6", // Default to blue-500
  loading = true,
}: LoadingSpinnerProps): JSX.Element | null {
  if (!loading) return null;

  return (
    <div className="flex items-center justify-center py-8">
      <SyncLoader color={color} size={size} margin={8} />
    </div>
  );
}
