import { useQuery } from "@tanstack/react-query";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Weight {
  id: string;
  date: string;
  weight: number;
}

interface WeightGraphProps {
  petId: string;
}

export default function WeightGraph({ petId }: WeightGraphProps) {
  const { data: weights, isLoading } = useQuery<Weight[]>({
    queryKey: ["weights", petId],
    queryFn: async () => {
      const response = await fetch(`/api/weights?petId=${petId}`);
      if (!response.ok) throw new Error("Failed to fetch weights");
      return response.json();
    },
  });

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-lg bg-gray-200" />;
  }

  if (!weights?.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50">
        <p className="text-gray-500">No weight records yet</p>
      </div>
    );
  }

  const chartData = {
    labels: weights.map((w) => new Date(w.date).toLocaleDateString()),
    datasets: [
      {
        label: "Weight (g)",
        data: weights.map((w) => w.weight),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Weight Over Time",
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Weight (g)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };

  return (
    <div className="h-64 w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}
