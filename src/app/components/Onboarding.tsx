import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Sparkles, TrendingUp, Trophy } from "lucide-react";

const slides = [
  {
    title: "Crea tus hábitos",
    description: "Define los hábitos que quieres construir y personalízalos con íconos, colores y recordatorios.",
    icon: Sparkles,
    gradient: "from-violet-400 to-purple-500",
    illustration: (
      <div className="relative w-full h-64 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-200/50 to-purple-300/50 rounded-3xl blur-3xl"></div>
        <div className="relative grid grid-cols-3 gap-4">
          {[
            { color: "from-orange-400 to-orange-600", icon: "💪" },
            { color: "from-blue-400 to-blue-600", icon: "📚" },
            { color: "from-green-400 to-emerald-500", icon: "💧" },
            { color: "from-purple-400 to-violet-500", icon: "🧘" },
            { color: "from-pink-400 to-pink-600", icon: "🎨" },
            { color: "from-yellow-400 to-orange-500", icon: "☀️" },
          ].map((item, i) => (
            <div
              key={i}
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl shadow-xl`}
            >
              {item.icon}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Sigue tu progreso",
    description: "Visualiza tu avance con gráficas, estadísticas y un calendario que muestra tu constancia día a día.",
    icon: TrendingUp,
    gradient: "from-blue-400 to-cyan-500",
    illustration: (
      <div className="relative w-full h-64 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 to-cyan-300/50 rounded-3xl blur-3xl"></div>
        <div className="relative space-y-4 w-full px-8">
          <div className="flex items-end justify-between h-32 gap-2">
            {[40, 65, 55, 80, 70, 90, 95].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-xl shadow-lg"
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-xl">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  87%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Celebra tus logros",
    description: "Construye rachas impresionantes, gana insignias y comparte tus victorias. ¡Cada paso cuenta!",
    icon: Trophy,
    gradient: "from-orange-400 to-red-500",
    illustration: (
      <div className="relative w-full h-64 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-200/50 to-red-300/50 rounded-3xl blur-3xl"></div>
        <div className="relative space-y-6">
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-2xl">
              <Trophy className="w-16 h-16 text-white" />
            </div>
          </div>
          <div className="flex justify-center gap-4">
            {["🔥", "⭐", "💎"].map((emoji, i) => (
              <div
                key={i}
                className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-3xl"
              >
                {emoji}
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl px-6 py-3 shadow-xl">
              <p className="text-center text-gray-600 text-sm">Racha actual</p>
              <p className="text-center text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                12 días
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

export function Onboarding() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-orange-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-center">

        {/* Panel izquierdo — solo en PC */}
        <div className="hidden md:flex flex-col justify-center flex-1 px-8">
          <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${slide.gradient} flex items-center justify-center mb-6 shadow-lg`}>
            <Icon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">{slide.title}</h1>
          <p className="text-xl text-gray-500 leading-relaxed">{slide.description}</p>
          <div className="flex gap-2 mt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? `w-8 bg-gradient-to-r ${slide.gradient}`
                    : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Panel derecho — ilustración + botones */}
        <div className="w-full md:max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6">

          {/* Skip — solo en celular */}
          <div className="flex justify-end md:hidden">
            <button onClick={() => navigate("/login")} className="text-gray-500 font-medium">
              Saltar
            </button>
          </div>

          {/* Skip — en PC arriba a la derecha */}
          <div className="hidden md:flex justify-end">
            <button onClick={() => navigate("/login")} className="text-gray-400 hover:text-gray-600 font-medium text-sm">
              Saltar →
            </button>
          </div>

          {/* Ilustración */}
          <div className="py-2">{slide.illustration}</div>

          {/* Texto — solo en celular */}
          <div className="text-center space-y-3 md:hidden">
            <h2 className="text-2xl font-bold text-gray-900">{slide.title}</h2>
            <p className="text-gray-600 leading-relaxed">{slide.description}</p>
          </div>

          {/* Dots — solo en celular */}
          <div className="flex justify-center gap-2 md:hidden">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? `w-8 bg-gradient-to-r ${slide.gradient}`
                    : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Botones de navegación */}
          <div className="flex gap-3 pt-2">
            {currentSlide > 0 && (
              <Button
                onClick={() => setCurrentSlide(currentSlide - 1)}
                variant="outline"
                className="flex-1 h-12 rounded-2xl border-2 border-gray-200"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Anterior
              </Button>
            )}
            {currentSlide < slides.length - 1 ? (
              <Button
                onClick={() => setCurrentSlide(currentSlide + 1)}
                className={`flex-1 h-12 bg-gradient-to-r ${slide.gradient} text-white font-bold rounded-2xl shadow-lg`}
              >
                Siguiente
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="flex-1 h-12 bg-gradient-to-r from-violet-600 to-orange-500 text-white font-bold rounded-2xl shadow-lg"
              >
                ¡Empezar!
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}