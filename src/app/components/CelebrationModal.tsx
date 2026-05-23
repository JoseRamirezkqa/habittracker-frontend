import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Button } from "./ui/button";
import { Flame, Trophy, Star, Sparkles } from "lucide-react";

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak?: number;
  habitName?: string;
}

export function CelebrationModal({
  isOpen,
  onClose,
  streak = 1,
  habitName = "tu hábito",
}: CelebrationModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Confetti from left
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#8B5CF6", "#F97316", "#EC4899", "#10B981", "#3B82F6"],
        });

        // Confetti from right
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#8B5CF6", "#F97316", "#EC4899", "#10B981", "#3B82F6"],
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const messages = [
    "¡Increíble trabajo!",
    "¡Sigue así!",
    "¡Eres imparable!",
    "¡Excelente!",
    "¡Racha activa! 🔥",
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-[340px] bg-white rounded-3xl shadow-2xl p-8 space-y-6 animate-in zoom-in duration-500">
        {/* Animated Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-orange-500 flex items-center justify-center shadow-2xl animate-pulse">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg animate-bounce">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg animate-bounce delay-150">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-orange-600 bg-clip-text text-transparent">
            {randomMessage}
          </h2>
          <p className="text-gray-700 text-lg">
            Has completado <span className="font-bold">{habitName}</span>
          </p>
        </div>

        {/* Streak Badge */}
        {streak > 1 && (
          <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-4 border-2 border-orange-300">
            <div className="flex items-center justify-center gap-2">
              <Flame className="w-6 h-6 text-orange-600" />
              <div>
                <p className="text-sm text-orange-800 font-medium">
                  Racha actual
                </p>
                <p className="text-2xl font-bold text-orange-900">
                  {streak} días seguidos
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Motivational Quote */}
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-4 border border-violet-200">
          <p className="text-center text-sm text-violet-800 italic">
            "La constancia es la clave del éxito"
          </p>
        </div>

        {/* Close Button */}
        <Button
          onClick={onClose}
          className="w-full h-14 bg-gradient-to-r from-violet-600 to-orange-500 hover:from-violet-700 hover:to-orange-600 text-white font-bold rounded-2xl shadow-lg text-lg"
        >
          ¡Genial!
        </Button>
      </div>
    </div>
  );
}
