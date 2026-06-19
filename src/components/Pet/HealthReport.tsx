"use client";

import { useGetWeightHistory } from "@/hooks/useQueries";
import { FullPetData, VetVisit, WeightRecord } from "@/types/pet";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Calendar,
  ClipboardList,
  Minus,
  Printer,
  Stethoscope,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useRef } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface HealthReportProps {
  pet: FullPetData;
  vetVisits: VetVisit[];
}

type WeightTrend = "up" | "down" | "stable" | "insufficient";

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "rgba(251, 250, 246, 0.97)",
  border: "1px solid #D9E2D8",
  borderRadius: "12px",
  padding: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  fontSize: "12px",
} as const;

const TREND_THRESHOLD_PERCENT = 5;
const TREND_WINDOW_SIZE = 5;
const RECENT_VISITS_COUNT = 5;

function computeAge(bornAt: string, isDead: boolean, deathDate?: string) {
  const birth = new Date(bornAt);
  const end = isDead && deathDate ? new Date(deathDate) : new Date();
  const totalDays = Math.floor((end.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
  const years = Math.floor(totalDays / 365.25);
  const remainingDays = totalDays - Math.floor(years * 365.25);
  const months = Math.floor(remainingDays / 30.44);
  const days = Math.floor(remainingDays - months * 30.44);
  return { years, months, days, totalDays };
}

function computeWeightTrend(records: WeightRecord[]): {
  trend: WeightTrend;
  changePercent: number;
} {
  if (!records || records.length < 2) {
    return { trend: "insufficient", changePercent: 0 };
  }

  const sorted = [...records].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const window = sorted.slice(-TREND_WINDOW_SIZE);
  const oldest = window[0].weight;
  const newest = window[window.length - 1].weight;

  if (oldest === 0) return { trend: "insufficient", changePercent: 0 };

  const changePercent = ((newest - oldest) / oldest) * 100;

  if (changePercent > TREND_THRESHOLD_PERCENT) return { trend: "up", changePercent };
  if (changePercent < -TREND_THRESHOLD_PERCENT) return { trend: "down", changePercent };
  return { trend: "stable", changePercent };
}

function formatDatePl(dateString: string | Date): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function HealthReport({ pet, vetVisits }: HealthReportProps) {
  const t = useTranslations("HealthReport");
  const reportRef = useRef<HTMLDivElement>(null);

  const { data: weightHistory = [] } = useGetWeightHistory(pet.id, pet.uuid);

  const age = useMemo(
    () => computeAge(pet.bornAt, pet.isDead, pet.deathDate),
    [pet.bornAt, pet.isDead, pet.deathDate],
  );

  const { trend, changePercent } = useMemo(
    () => computeWeightTrend(weightHistory as WeightRecord[]),
    [weightHistory],
  );

  const recentVisits = useMemo(() => {
    return [...vetVisits]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, RECENT_VISITS_COUNT);
  }, [vetVisits]);

  const recentMedications = useMemo(() => {
    const meds = vetVisits
      .filter((v) => v.medication && v.medication.trim() !== "")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, RECENT_VISITS_COUNT);
    return meds;
  }, [vetVisits]);

  const chartData = useMemo(() => {
    if (!weightHistory || weightHistory.length === 0) return [];
    return [...(weightHistory as WeightRecord[])]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [weightHistory]);

  const ageText = useMemo(() => {
    const parts: string[] = [];
    if (age.years > 0) parts.push(t("ageYears", { count: age.years }));
    if (age.months > 0) parts.push(t("ageMonths", { count: age.months }));
    if (age.years === 0 && age.months === 0) parts.push(t("ageDays", { count: age.days }));
    return parts.join(", ");
  }, [age, t]);

  const handlePrint = () => {
    window.print();
  };

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-emerald-600"
      : trend === "down"
        ? "text-danger-600"
        : "text-secondary-600";
  const trendBg =
    trend === "up"
      ? "bg-emerald-50 border-emerald-200"
      : trend === "down"
        ? "bg-danger-50 border-danger-200"
        : "bg-secondary-50 border-secondary-200";

  return (
    <>
      <style>{`
        @media print {
          body > * { visibility: hidden !important; }
          [data-health-report],
          [data-health-report] * { visibility: visible !important; }
          [data-health-report] {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 20px !important;
            margin: 0 !important;
          }
          [data-print-hide] { display: none !important; }
        }
      `}</style>

      <div
        ref={reportRef}
        data-health-report
        className="card-modern rounded-2xl p-6 sm:p-8 relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-primary-400/20 rounded-xl">
              <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gradient">{t("title")}</h2>
              <p className="text-sm text-secondary-600">
                {pet.name} • {formatDatePl(new Date().toISOString())}
              </p>
            </div>
          </div>
          <button
            onClick={handlePrint}
            data-print-hide
            className="btn-secondary px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium hover:scale-105 transition-all duration-300"
          >
            <Printer className="w-4 h-4" />
            {t("print")}
          </button>
        </div>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Age */}
          <div className="glass-effect p-4 rounded-xl border border-primary-400/30 bg-primary-400/10">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-primary-500" />
              <span className="text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                {pet.isDead ? t("livedFor") : t("age")}
              </span>
            </div>
            <p className="text-lg font-bold text-primary-700">{ageText}</p>
            <p className="text-xs text-secondary-500 mt-1">
              {t("born")}: {formatDatePl(pet.bornAt)}
            </p>
          </div>

          {/* Current Weight */}
          <div className="glass-effect p-4 rounded-xl border border-secondary-200/50 bg-secondary-50/80">
            <div className="flex items-center gap-2 mb-2">
              <Stethoscope className="w-4 h-4 text-secondary-600" />
              <span className="text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                {t("currentWeight")}
              </span>
            </div>
            <p className="text-lg font-bold text-secondary-800">
              {pet.weight != null ? `${pet.weight} g` : t("noWeight")}
            </p>
            <p className="text-xs text-secondary-500 mt-1">
              {t("measurements", { count: (weightHistory as WeightRecord[]).length })}
            </p>
          </div>

          {/* Weight Trend */}
          <div className={`glass-effect p-4 rounded-xl border ${trendBg}`}>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-secondary-600" />
              <span className="text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                {t("weightTrend")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendIcon className={`w-5 h-5 ${trendColor}`} />
              <p className={`text-lg font-bold ${trendColor}`}>
                {trend === "insufficient"
                  ? t("trendInsufficient")
                  : trend === "up"
                    ? t("trendUp")
                    : trend === "down"
                      ? t("trendDown")
                      : t("trendStable")}
              </p>
            </div>
            {trend !== "insufficient" && (
              <p className="text-xs text-secondary-500 mt-1">
                {changePercent > 0 ? "+" : ""}
                {changePercent.toFixed(1)}% ({t("trendWindow", { count: TREND_WINDOW_SIZE })})
              </p>
            )}
          </div>

          {/* Visits Count */}
          <div className="glass-effect p-4 rounded-xl border border-primary-400/30 bg-primary-400/10">
            <div className="flex items-center gap-2 mb-2">
              <Stethoscope className="w-4 h-4 text-primary-500" />
              <span className="text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                {t("vetVisits")}
              </span>
            </div>
            <p className="text-lg font-bold text-primary-700">{vetVisits.length}</p>
            {recentVisits.length > 0 && (
              <p className="text-xs text-secondary-500 mt-1">
                {t("lastVisit")}: {formatDatePl(recentVisits[0].date)}
              </p>
            )}
          </div>
        </div>

        {/* Weight Chart */}
        {chartData.length > 1 && (
          <div className="glass-effect bg-background/60 border border-border/70 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-secondary-700 mb-3 uppercase tracking-wider">
              {t("weightChart")}
            </h3>
            <div className="h-[180px] sm:h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke="#D9E2D8"
                  />
                  <XAxis
                    dataKey="createdAt"
                    tickFormatter={(v) => formatDatePl(v)}
                    tick={{ fontSize: 10, fill: "#5B6B63" }}
                    stroke="#94A39B"
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[0, "auto"]}
                    tick={{ fontSize: 10, fill: "#5B6B63" }}
                    tickCount={5}
                    allowDecimals={false}
                    stroke="#94A39B"
                    width={35}
                  />
                  <Tooltip
                    labelFormatter={(v) => formatDatePl(v)}
                    formatter={(value) => [`${value} g`, t("weightLabel")]}
                    contentStyle={CHART_TOOLTIP_STYLE}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="url(#healthReportGradient)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#3F6F5E", strokeWidth: 2, stroke: "#FBFAF6" }}
                    activeDot={{ r: 5, fill: "#355E50", strokeWidth: 3, stroke: "#FBFAF6" }}
                  />
                  <defs>
                    <linearGradient id="healthReportGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3F6F5E" />
                      <stop offset="100%" stopColor="#98BFAF" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Two-column: Recent Visits + Medications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recent Vet Visits */}
          <div className="glass-effect bg-background/60 border border-border/70 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-secondary-700 mb-3 uppercase tracking-wider flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              {t("recentVisits")}
            </h3>
            {recentVisits.length > 0 ? (
              <div className="space-y-3">
                {recentVisits.map((visit) => (
                  <div
                    key={visit.id}
                    className="border-l-3 border-primary-400 pl-3 py-1"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-primary-600">
                        {formatDatePl(visit.date)}
                      </span>
                    </div>
                    <p className="text-sm text-secondary-800">{visit.description}</p>
                    {visit.medication && visit.medication.trim() !== "" && (
                      <p className="text-xs text-secondary-500 mt-0.5">
                        {t("medication")}: {visit.medication}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-secondary-500 italic">{t("noVisits")}</p>
            )}
          </div>

          {/* Medications */}
          <div className="glass-effect bg-background/60 border border-border/70 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-secondary-700 mb-3 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4" />
              {t("medications")}
            </h3>
            {recentMedications.length > 0 ? (
              <div className="space-y-3">
                {recentMedications.map((visit) => (
                  <div key={visit.id} className="flex items-start gap-3 py-1">
                    <div className="mt-1">
                      <ArrowRight className="w-3 h-3 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-secondary-800">{visit.medication}</p>
                      <p className="text-xs text-secondary-500">
                        {formatDatePl(visit.date)} — {visit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-secondary-500 italic">{t("noMedications")}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        {pet.notes && pet.notes.trim() !== "" && (
          <div className="glass-effect bg-background/60 border border-border/70 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-secondary-700 mb-3 uppercase tracking-wider">
              {t("notes")}
            </h3>
            <p className="text-sm text-secondary-700 whitespace-pre-wrap leading-relaxed">
              {pet.notes}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
