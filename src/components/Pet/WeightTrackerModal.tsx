"use client";

import LoadingSpinner from "@/components/Animations/LoadingSpinner";
import { useAddWeightRecord, useDeleteWeightRecord, useGetWeightHistory } from "@/hooks/useQueries";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
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

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={(e) => {
        // Only close if clicking the backdrop, not the modal content
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="card-modern glass-effect bg-white/95 backdrop-blur-xl rounded-2xl p-3 sm:p-4 max-w-md sm:max-w-4xl lg:max-w-6xl xl:max-w-7xl w-full mx-2 sm:mx-4 relative overflow-hidden h-[85vh] sm:h-[90vh] flex flex-col animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient decoration */}
        <div className="relative mb-3 sm:mb-4 shrink-0">
          <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-bl from-primary-200/30 to-transparent rounded-full blur-2xl" />
          <div className="relative flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-primary-100/80 rounded-xl">
              <LineChart className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gradient mb-1">Historia wagi</h2>
            </div>
          </div>
        </div>

        {/* Add new weight section - compressed */}
        <div className="glass-effect bg-primary-50/50 backdrop-blur-sm p-2 sm:p-3 rounded-lg border border-primary-200/50 mb-3 sm:mb-4 shrink-0">
          <label className="block text-xs font-semibold text-secondary-700 mb-1 sm:mb-2">
            Nowa waga [g]
          </label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              type="number"
              placeholder="Waga w gramach"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              min="1"
              max="10000"
              className="flex-1 p-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/90 backdrop-blur-sm transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm"
            />
            <button
              onClick={handleAddWeight}
              disabled={addWeightMutation.isPending}
              className="btn-primary px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 text-sm whitespace-nowrap"
            >
              {addWeightMutation.isPending ? (
                <div className="flex items-center gap-2 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Dodawanie...</span>
                  <span className="sm:hidden">...</span>
                </div>
              ) : (
                "Dodaj"
              )}
            </button>
          </div>
        </div>

        {/* Content area with proper scrolling - fixed height for optimal viewing */}
        <div className="flex-1 min-h-0 overflow-hidden" style={{ minHeight: "500px" }}>
          {isLoading ? (
            <div className="h-full flex items-center justify-center glass-effect bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50">
              <LoadingSpinner />
            </div>
          ) : weightHistory && weightHistory.length > 0 ? (
            <div className="h-full flex flex-col gap-3 sm:gap-4">
              {/* Chart section - optimal height for visibility */}
              <div className="glass-effect bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl p-2 sm:p-3 shrink-0 h-[180px] sm:h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightHistory} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={true}
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="createdAt"
                      tickFormatter={formatDate}
                      tick={{ fontSize: 10, fill: "#64748b" }}
                      stroke="#94a3b8"
                      interval="preserveStartEnd"
                      className="sm:text-xs"
                    />
                    <YAxis
                      domain={[0, "auto"]}
                      tick={{ fontSize: 10, fill: "#64748b" }}
                      tickCount={5}
                      allowDecimals={false}
                      stroke="#94a3b8"
                      width={30}
                      className="sm:text-xs sm:w-10"
                    />
                    <Tooltip
                      labelFormatter={formatDate}
                      formatter={(value) => [`${value} g`, "Waga"]}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        padding: "8px",
                        boxShadow:
                          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        backdropFilter: "blur(8px)",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="url(#weightGradient)"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#16a34a", strokeWidth: 2, stroke: "#ffffff" }}
                      activeDot={{ r: 5, fill: "#15803d", strokeWidth: 3, stroke: "#ffffff" }}
                      className="sm:stroke-[3] sm:[&>circle]:r-[5] sm:[&>circle:hover]:r-[7]"
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

              {/* History table section - guaranteed height for at least 3 records */}
              <div
                className="glass-effect bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl p-3 sm:p-4 flex-1 min-h-0 flex flex-col"
                style={{ minHeight: "240px" }}
              >
                {/* Scrollable content container */}
                <div className="flex-1 min-h-0 relative" style={{ minHeight: "200px" }}>
                  {/* Desktop table view */}
                  <div className="hidden sm:block absolute inset-0">
                    <div
                      className="h-full overflow-y-auto overflow-x-hidden rounded-lg border border-gray-200/30"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#cbd5e1 #f1f5f9",
                      }}
                    >
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-primary-50/95 backdrop-blur-sm z-10 border-b border-primary-200/50">
                          <tr>
                            <th className="text-left py-3 px-4 font-semibold text-secondary-700">
                              Data
                            </th>
                            <th className="text-right py-3 px-4 font-semibold text-secondary-700">
                              Waga [g]
                            </th>
                            <th className="w-12 py-3 px-4"></th>
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
                                <td className="py-3 px-4 text-secondary-700">
                                  {formatDateTime(record.createdAt)}
                                </td>
                                <td className="text-right py-3 px-4 font-medium text-secondary-800">
                                  {record.weight}
                                </td>
                                <td className="text-right py-3 px-4">
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

                  {/* Mobile card view */}
                  <div className="sm:hidden absolute inset-0">
                    <div
                      className="h-full overflow-y-auto overflow-x-hidden"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#cbd5e1 #f1f5f9",
                        WebkitOverflowScrolling: "touch",
                      }}
                    >
                      <div className="space-y-2 p-1">
                        {weightHistory
                          .slice()
                          .sort(
                            (a, b) =>
                              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                          )
                          .map((record) => (
                            <div
                              key={record.id}
                              className={`bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg p-3 transition-all duration-200 ${
                                deletingId === record.id.toString() ? "opacity-50" : "opacity-100"
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="text-xs text-secondary-600 mb-1">
                                    {formatDateTime(record.createdAt)}
                                  </div>
                                  <div className="font-semibold text-secondary-800">
                                    {record.weight} g
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDeleteWeight(petId, record.id)}
                                  disabled={deletingId === record.id.toString()}
                                  className="text-gray-400 hover:text-red-500 transition-all duration-200 inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed ml-2 shrink-0"
                                  title="Usuń pomiar"
                                >
                                  {deletingId === record.id.toString() ? (
                                    <Loader2 size={16} className="animate-spin text-gray-400" />
                                  ) : (
                                    <Trash2 size={16} />
                                  )}
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center glass-effect bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 text-secondary-600 p-4">
              <LineChart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mb-3 sm:mb-4" />
              <p className="text-base sm:text-lg font-medium text-center">Brak historii wagi</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center px-2">
                Dodaj pierwszy pomiar, aby rozpocząć śledzenie
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 sm:mt-6 flex justify-end border-t border-gray-200/50 pt-3 sm:pt-4 shrink-0">
          <button
            onClick={onClose}
            className="btn-secondary px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 text-sm sm:text-base"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
