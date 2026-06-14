import { Camera, PawPrint, Plus, Scale, Stethoscope } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

interface OnboardingEmptyStateProps {
  onAddPet: () => void;
  firstName?: string | null;
}

const FEATURE_ICONS = [Scale, Stethoscope, Camera];

const OnboardingEmptyState: React.FC<OnboardingEmptyStateProps> = ({ onAddPet, firstName }) => {
  const t = useTranslations("Onboarding");

  const greeting = firstName ? t("greeting", { name: firstName }) : t("greetingFallback");

  const features = [
    {
      icon: FEATURE_ICONS[0],
      title: t("feature1Title"),
      description: t("feature1Description"),
    },
    {
      icon: FEATURE_ICONS[1],
      title: t("feature2Title"),
      description: t("feature2Description"),
    },
    {
      icon: FEATURE_ICONS[2],
      title: t("feature3Title"),
      description: t("feature3Description"),
    },
  ];

  return (
    <div className="animate-in mx-auto max-w-3xl">
      <div className="card-modern relative overflow-hidden rounded-2xl p-8 sm:p-10 text-center">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary-400 opacity-20 blur-3xl" />

        <div className="relative">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-400/30 to-primary-500/40 shadow-modern">
            <PawPrint className="h-8 w-8 text-primary-600" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gradient mb-3">{greeting}</h1>
          <p className="mx-auto max-w-xl text-secondary-600 mb-8">
            {t("description")}
          </p>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="glass-effect rounded-xl p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-modern-lg"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-secondary-800 mb-1">{title}</h3>
                <p className="text-sm text-secondary-500">{description}</p>
              </div>
            ))}
          </div>

          <button
            onClick={onAddPet}
            className="btn-primary mx-auto flex items-center gap-2 rounded-xl px-6 py-3 text-base font-medium"
          >
            <Plus className="h-5 w-5" />
            {t("addFirstPet")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingEmptyState;
