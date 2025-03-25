"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { useAddWeightRecord, useDeleteWeightRecord, useGetWeightHistory } from "@/hooks/useQueries";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface WeightTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  petId: number;
  currentWeight: number;
}

export default function WeightTrackerModal({
  isOpen,
  onClose,
  petId,
  currentWeight,
}: WeightTrackerModalProps): JSX.Element {
  const [newWeight, setNewWeight] = useState<string>(currentWeight?.toString() ?? "0");
  const { data: weightHistory, isLoading } = useGetWeightHistory(petId);
  const addWeightMutation = useAddWeightRecord();
  const deleteWeightMutation = useDeleteWeightRecord();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAddWeight = (): void => {
    const weightValue = parseFloat(newWeight);
    if (isNaN(weightValue) || weightValue <= 0) return;

    addWeightMutation.mutate(
      {
        petId,
        weight: weightValue,
      },
      {
        onSuccess: () => {
          setNewWeight(weightValue.toString());
        },
      },
    );
  };

  const handleDeleteWeight = (petId: number, id: string): void => {
    setDeletingId(id);
    deleteWeightMutation.mutate(
      { petId, id },
      {
        onSuccess: () => {
          setDeletingId(null);
        },
        onError: () => {
          setDeletingId(null);
        },
      },
    );
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Nieprawidłowa data";
      }
      return date.toLocaleDateString("pl-PL", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (error) {
      return "Nieprawidłowa data";
    }
  };

  const formatDateTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Nieprawidłowa data";
      }
      return date.toLocaleDateString("pl-PL", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Nieprawidłowa data";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-3xl w-full mx-4 relative overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-primary-800 mb-6">Historia wagi</h2>
        <div className="space-y-4">
          <p>Nowa waga [g]</p>
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Waga w gramach"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              min="1"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <button
              onClick={handleAddWeight}
              disabled={addWeightMutation.isPending}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400"
            >
              {addWeightMutation.isPending ? "Dodawanie..." : "Dodaj"}
            </button>
          </div>

          <div className="mt-6">
            {isLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : weightHistory && weightHistory.length > 0 ? (
              <>
                <div className="h-[400px] border rounded-lg p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={weightHistory}
                      margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis
                        dataKey="createdAt"
                        tickFormatter={formatDate}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        domain={[0, "auto"]}
                        tick={{ fontSize: 12 }}
                        tickCount={8}
                        allowDecimals={false}
                      />
                      <Tooltip
                        labelFormatter={formatDate}
                        formatter={(value) => [`${value} g`, "Waga"]}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          padding: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 border rounded-lg p-4 max-h-[250px] overflow-y-auto">
                  <h3 className="font-medium mb-2">Historia pomiarów:</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Data</th>
                        <th className="text-right py-2">Waga [g]</th>
                        <th className="w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {weightHistory
                        .slice()
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                        )
                        .map((record) => (
                          <tr
                            key={record.id}
                            className={`border-b last:border-b-0 transition-opacity duration-200 ${
                              deletingId === record.id ? "opacity-50" : "opacity-100"
                            }`}
                          >
                            <td className="py-2">{formatDateTime(record.createdAt)}</td>
                            <td className="text-right py-2">{record.weight}</td>
                            <td className="text-right py-2">
                              <button
                                onClick={() => handleDeleteWeight(petId, record.id)}
                                disabled={deletingId === record.id}
                                className="text-gray-500 hover:text-red-500 transition-colors inline-flex items-center justify-center w-6 h-6"
                                title="Usuń pomiar"
                              >
                                {deletingId === record.id ? (
                                  <Loader2 size={14} className="animate-spin text-gray-400" />
                                ) : (
                                  <Trash2 size={14} />
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-gray-500 border rounded-lg">
                Brak historii wagi
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
