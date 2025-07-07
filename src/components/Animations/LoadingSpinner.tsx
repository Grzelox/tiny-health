import { SyncLoader } from "react-spinners";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  loading?: boolean;
}

export default function LoadingSpinner({
  size = 15,
  color = "#8a8e75", // Default to primary-500
  loading = true,
}: LoadingSpinnerProps): JSX.Element | null {
  if (!loading) return null;

  return (
    <div className="flex items-center justify-center py-8">
      <SyncLoader color={color} size={size} margin={8} />
    </div>
  );
}
