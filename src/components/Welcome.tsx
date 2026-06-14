import { SignUpButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { BarChart3, Camera, Download, Heart, RatIcon, Shield, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: any;
  title: string;
  description: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="group"
  >
    <div className="card-modern p-8 rounded-2xl h-full hover:shadow-intense-glow hover:-translate-y-3 transition-all duration-500 group-hover:border-primary-400/50">
      <div className="flex flex-col items-center text-center h-full">
        <div className="relative p-4 bg-primary-500 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-modern-lg group-hover:bg-primary-600 group-hover:shadow-intense-glow">
          <div className="absolute inset-0 bg-intense-gradient rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
          <Icon className="w-8 h-8 text-white relative z-10" />
        </div>
        <h3 className="text-xl font-semibold text-gradient mb-4 group-hover:from-primary-600 group-hover:to-primary-800 transition-all duration-300">
          {title}
        </h3>
        <p className="text-secondary-700 leading-relaxed group-hover:text-secondary-800 transition-colors duration-300 font-medium">
          {description}
        </p>
      </div>
    </div>
  </motion.div>
);

const ImageShowcase = ({
  src,
  alt,
  title,
  description,
  reverse = false,
  delay = 0,
}: {
  src: string;
  alt: string;
  title: string;
  description: string;
  reverse?: boolean;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: reverse ? 50 : -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay }}
    className={`flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12 lg:gap-16`}
  >
    <div className="flex-1">
      <div className="relative group">
        <div className="relative card-modern p-4 rounded-3xl overflow-hidden">
          <div className="relative aspect-video">
            <Image
              src={src}
              alt={alt}
              fill
              priority
              className="object-contain transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </div>
    <div className="flex-1 text-center lg:text-left">
      <h3 className="text-3xl lg:text-4xl font-bold text-gradient mb-6">{title}</h3>
      <p className="text-lg text-secondary-800 leading-relaxed max-w-lg font-medium">
        {description}
      </p>
    </div>
  </motion.div>
);

export default function Welcome() {
  const t = useTranslations("Welcome");

  const features = [
    {
      icon: Heart,
      title: t("featureVetTitle"),
      description: t("featureVetDescription"),
    },
    {
      icon: BarChart3,
      title: t("featureWeightTitle"),
      description: t("featureWeightDescription"),
    },
    {
      icon: Camera,
      title: t("featureGalleryTitle"),
      description: t("featureGalleryDescription"),
    },
    {
      icon: Users,
      title: t("featureSharingTitle"),
      description: t("featureSharingDescription"),
    },
    {
      icon: Download,
      title: t("featureExportTitle"),
      description: t("featureExportDescription"),
    },
    {
      icon: Shield,
      title: t("featureFreeTitle"),
      description: t("featureFreeDescription"),
    },
  ];

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features-section");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20 pb-32">
        {/* Hero Section */}
        <div className="container mx-auto px-4 text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            {/* Logo/Icon */}
            <div className="flex justify-center mb-12">
              <div className="relative">
                <div className="absolute inset-0 bg-intense-gradient rounded-3xl blur-sm opacity-30"></div>
                <div className="relative p-6 bg-card-gradient backdrop-blur-sm rounded-3xl shadow-intense-glow border border-primary-400/30">
                  <RatIcon className="w-16 h-16 text-primary-500" />
                </div>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="text-gradient">tiny health</span>
              <br />
              <span className="text-2xl md:text-4xl lg:text-5xl font-medium text-secondary-700">
                {t("heroSubtitle")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-secondary-700 max-w-4xl mx-auto mb-12 leading-relaxed font-medium">
              {t("heroDescription")}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <SignUpButton mode="modal">
                <button className="btn-primary px-8 py-4 text-lg font-semibold rounded-xl hover:scale-105 transition-transform duration-300">
                  {t("ctaStart")}
                </button>
              </SignUpButton>
              <button
                onClick={scrollToFeatures}
                className="btn-secondary px-8 py-4 text-lg font-semibold rounded-xl hover:scale-105 transition-transform duration-300"
              >
                {t("ctaSeeFeatures")}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div id="features-section" className="container mx-auto px-4 mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-6">
              {t("featuresHeading")}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={0.3 + index * 0.1}
              />
            ))}
          </div>
        </div>

        {/* Image Showcases */}
        <div className="container mx-auto px-4 space-y-32 mb-32">
          <ImageShowcase
            src="/example1.webp"
            alt={t("showcaseSimpleAlt")}
            title={t("showcaseSimpleTitle")}
            description={t("showcaseSimpleDescription")}
            delay={0.2}
          />

          <ImageShowcase
            src="/example2.webp"
            alt={t("showcaseMemoriesAlt")}
            title={t("showcaseMemoriesTitle")}
            description={t("showcaseMemoriesDescription")}
            reverse={true}
            delay={0.4}
          />

          <ImageShowcase
            src="/example3.webp"
            alt={t("showcaseSecureAlt")}
            title={t("showcaseSecureTitle")}
            description={t("showcaseSecureDescription")}
            delay={0.6}
          />
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="container mx-auto px-4 text-center"
        >
          <div className="card-modern p-12 rounded-3xl max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-intense-gradient opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary-100/60 to-secondary-100/60" />
            <div className="relative">
              <p className="text-xl text-secondary-800 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
                {t("finalCtaText")}
              </p>
              <SignUpButton mode="modal">
                <button className="btn-primary px-10 py-4 text-lg font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-intense-glow">
                  {t("finalCtaButton")}
                </button>
              </SignUpButton>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
