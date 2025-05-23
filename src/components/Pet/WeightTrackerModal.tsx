"use client";

import LoadingSpinner from "@/components/Animations/LoadingSpinner";
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
  currentWeight: number | null;
  uuid: string;
}

export default function WeightTrackerModal({
  isOpen,
  onClose,
  petId,
  currentWeight,
  uuid,
}: WeightTrackerModalProps): JSX.Element {
  const [newWeight, setNewWeight] = useState<string>(currentWeight?.toString() ?? "");
  const { data: weightHistory, isLoading } = useGetWeightHistory(petId, uuid);
  const addWeightMutation = useAddWeightRecord();
  const deleteWeightMutation = useDeleteWeightRecord();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAddWeight = (): void => {
    const weightValue = parseFloat(newWeight);
    if (isNaN(weightValue) || weightValue <= 0) return;

    addWeightMutation.mutate(
      {
        data: {
          petId,
          weight: weightValue,
        },
        petUuid: uuid,
      },
      {
        onSuccess: () => {
          setNewWeight(weightValue.toString());
        },
      },
    );
  };

  const handleDeleteWeight = (petId: number, id: number): void => {
    setDeletingId(id.toString());
    deleteWeightMutation.mutate(
      { petId, id: id.toString(), petUuid: uuid },
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-modern glass-effect bg-white/95 backdrop-blur-xl rounded-2xl p-8 max-w-4xl w-full mx-4 relative overflow-hidden max-h-[90vh] flex flex-col animate-in">
        {/* Header with gradient decoration */}
        <div className="relative mb-8">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-200/30 to-transparent rounded-full blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 bg-primary-100/80 rounded-xl">
              <LineChart className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gradient mb-1">Historia wagi</h2>
              <p className="text-secondary-600">Śledzenie zmian wagi zwierzęcia</p>
            </div>
          </div>
        </div>

        {/* Add new weight section */}
        <div className="glass-effect bg-primary-50/50 backdrop-blur-sm p-6 rounded-xl border border-primary-200/50 mb-6">
          <label className="block text-sm font-semibold text-secondary-700 mb-3">
            Nowa waga [g]
          </label>
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Waga w gramach"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              min="1"
              max="10000"
              className="flex-1 p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/90 backdrop-blur-sm transition-all duration-200 text-gray-900 placeholder-gray-500"
            />
            <button
              onClick={handleAddWeight}
              disabled={addWeightMutation.isPending}
              className="btn-primary px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            >
              {addWeightMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Dodawanie...
                </div>
              ) : (
                "Dodaj"
              )}
            </button>
          </div>
        </div>

        {/* Content area with scroll */}
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center glass-effect bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50">
              <LoadingSpinner />
            </div>
          ) : weightHistory && weightHistory.length > 0 ? (
            <div className="space-y-6 h-full flex flex-col">
              {/* Chart */}
              <div className="glass-effect bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={weightHistory}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={true}
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="createdAt"
                      tickFormatter={formatDate}
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      stroke="#94a3b8"
                    />
                    <YAxis
                      domain={[0, "auto"]}
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      tickCount={8}
                      allowDecimals={false}
                      stroke="#94a3b8"
                    />
                    <Tooltip
                      labelFormatter={formatDate}
                      formatter={(value) => [`${value} g`, "Waga"]}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        padding: "12px",
                        boxShadow:
                          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        backdropFilter: "blur(8px)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="url(#weightGradient)"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#16a34a", strokeWidth: 2, stroke: "#ffffff" }}
                      activeDot={{ r: 7, fill: "#15803d", strokeWidth: 3, stroke: "#ffffff" }}
                    />
                    <defs>
                      <linearGradient id="weightGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#16a34a" />
                        <stop offset="100%" stopColor="#22c55e" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* History table */}
              <div className="glass-effect bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 flex-1 overflow-hidden">
                <h3 className="font-semibold text-lg text-secondary-800 mb-4">
                  Historia pomiarów:
                </h3>
                <div className="overflow-y-auto max-h-[250px] rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-primary-50/80 backdrop-blur-sm">
                      <tr className="border-b border-primary-200/50">
                        <th className="text-left py-3 px-2 font-semibold text-secondary-700">
                          Data
                        </th>
                        <th className="text-right py-3 px-2 font-semibold text-secondary-700">
                          Waga [g]
                        </th>
                        <th className="w-10 py-3 px-2"></th>
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
                            className={`border-b border-gray-100 last:border-b-0 transition-all duration-200 hover:bg-primary-50/30 ${
                              deletingId === record.id.toString() ? "opacity-50" : "opacity-100"
                            }`}
                          >
                            <td className="py-3 px-2 text-secondary-700">
                              {formatDateTime(record.createdAt)}
                            </td>
                            <td className="text-right py-3 px-2 font-medium text-secondary-800">
                              {record.weight}
                            </td>
                            <td className="text-right py-3 px-2">
                              <button
                                onClick={() => handleDeleteWeight(petId, record.id)}
                                disabled={deletingId === record.id.toString()}
                                className="text-gray-400 hover:text-red-500 transition-all duration-200 inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed group"
                                title="Usuń pomiar"
                              >
                                {deletingId === record.id.toString() ? (
                                  <Loader2 size={14} className="animate-spin text-gray-400" />
                                ) : (
                                  <Trash2
                                    size={14}
                                    className="group-hover:scale-110 transition-transform duration-200"
                                  />
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center glass-effect bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 text-secondary-600">
              <LineChart className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-lg font-medium">Brak historii wagi</p>
              <p className="text-sm text-gray-500 mt-2">
                Dodaj pierwszy pomiar, aby rozpocząć śledzenie
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end border-t border-gray-200/50 pt-6">
          <button
            onClick={onClose}
            className="btn-secondary px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
