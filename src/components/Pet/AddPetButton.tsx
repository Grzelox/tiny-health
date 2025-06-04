import { Plus } from "lucide-react";

interface AddPetButtonProps {
  onClick: () => void;
}

const AddPetButton = ({ onClick }: AddPetButtonProps) => {
  return (
    <button
      className="
        h-64 flex items-center justify-center rounded-xl overflow-hidden
        bg-gradient-to-br from-white/60 via-primary-400/20 to-secondary-50/30
        backdrop-blur-sm border-2 border-dashed border-primary-400/60
        hover:border-primary-400 hover:from-primary-400/30 hover:via-primary-400/40 hover:to-secondary-100/40
        hover:shadow-modern-lg hover:-translate-y-1
        transition-all duration-300 group animate-in
      "
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-primary-400 group-hover:text-primary-500 transition-colors duration-300">
        <div
          className="
                      p-3 rounded-full bg-gradient-to-br from-primary-400/20 to-primary-400/40
            backdrop-blur-xs group-hover:from-primary-400/30 group-hover:to-primary-400/50
          group-hover:scale-110 transition-all duration-300 mb-3
          shadow-modern group-hover:shadow-glow
        "
        >
          <Plus className="w-8 h-8 transition-transform duration-300 group-hover:rotate-90" />
        </div>
        <span className="text-lg font-medium transition-all duration-300 group-hover:scale-105">
          Dodaj gryzonia
        </span>
      </div>
    </button>
  );
};

export default AddPetButton;
