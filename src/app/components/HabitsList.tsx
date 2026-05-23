import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "./BottomNav";
import { Button } from "./ui/button";
import { CelebrationModal } from "./CelebrationModal";
import {
  Dumbbell, Book, Heart, Briefcase, Droplet,
  Moon, Check, Plus, Filter,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const categoryColors: Record<string, string> = {
  salud: "from-green-400 to-emerald-500",
  productividad: "from-blue-400 to-blue-600",
  bienestar: "from-purple-400 to-violet-500",
  ejercicio: "from-orange-400 to-orange-600",
  mindfulness: "from-pink-400 to-pink-600",
};

const categoryBgColors: Record<string, string> = {
  salud: "bg-green-100",
  productividad: "bg-blue-100",
  bienestar: "bg-purple-100",
  ejercicio: "bg-orange-100",
  mindfulness: "bg-pink-100",
};

const categoryTextColors: Record<string, string> = {
  salud: "text-green-700",
  productividad: "text-blue-700",
  bienestar: "text-purple-700",
  ejercicio: "text-orange-700",
  mindfulness: "text-pink-700",
};

const iconMap: Record<string, any> = {
  dumbbell: Dumbbell, book: Book, heart: Heart,
  briefcase: Briefcase, droplet: Droplet, moon: Moon,
};

const categories = ["Todos", "Ejercicio", "Productividad", "Bienestar", "Salud", "Mindfulness"];

export function HabitsList() {
  const navigate = useNavigate();
  const [habits, setHabits] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [cargando, setCargando] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationHabit, setCelebrationHabit] = useState<any>(null);

  useEffect(() => {
    cargarHabitos();
  }, []);

  const cargarHabitos = async () => {
    try {
      const usuarioGuardado = localStorage.getItem("usuario");
      if (!usuarioGuardado) { navigate("/"); return; }
      const usuario = JSON.parse(usuarioGuardado);

      const res = await fetch(`${API_URL}/habitos/usuario/${usuario.id}`);
      const data = await res.json();

      const habitosConEstado = await Promise.all(
        data.map(async (h: any) => {
          const resHoy = await fetch(`${API_URL}/registros/habito/${h.id}/hoy`);
          const completadoHoy = await resHoy.json();
          return { ...h, completadoHoy };
        })
      );
      setHabits(habitosConEstado);
    } catch (e) {
      console.error("Error cargando hábitos", e);
    } finally {
      setCargando(false);
    }
  };

const toggleHabit = async (e: React.MouseEvent, habito: any) => {
  e.stopPropagation();
  try {
    if (habito.completadoHoy) {
      await fetch(`${API_URL}/registros/desmarcar/${habito.id}`, { method: "DELETE" });
      setHabits((prev) =>
        prev.map((h) => h.id === habito.id ? { ...h, completadoHoy: false, rachaActual: Math.max(0, h.rachaActual - 1) } : h)
      );
    } else {
      await fetch(`${API_URL}/registros/completar/${habito.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notas: "" }),
      });
      setHabits((prev) =>
        prev.map((h) => h.id === habito.id ? { ...h, completadoHoy: true, rachaActual: h.rachaActual + 1 } : h)
      );
      setCelebrationHabit(habito);
      setShowCelebration(true);
    }
  } catch (e) {
    console.error("Error toggling hábito", e);
  }
};

  const filteredHabits = selectedCategory === "Todos"
    ? habits
    : habits.filter((h) => h.categoria?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-orange-50 pb-24">
      <div className="max-w-[375px] mx-auto">
        <div className="bg-gradient-to-r from-violet-600 to-orange-500 rounded-b-3xl shadow-xl p-6 pb-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-white text-2xl font-bold">Mis Hábitos</h1>
              <Button
                onClick={() => navigate("/add-habit")}
                className="rounded-full w-10 h-10 p-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
              >
                <Plus className="w-5 h-5 text-white" />
              </Button>
            </div>
            <p className="text-white/80 text-sm">{filteredHabits.length} hábitos en total</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Filtros sin scroll horizontal */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-2 rounded-xl font-medium text-sm transition-all ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-violet-600 to-orange-500 text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {cargando ? (
            <p className="text-center text-gray-500 py-8">Cargando hábitos...</p>
          ) : (
            <div className="space-y-3">
              {filteredHabits.map((habit) => {
                const Icon = iconMap[habit.icono] || Dumbbell;
                const cat = habit.categoria?.toLowerCase() || "ejercicio";
                return (
                  <div
                    key={habit.id}
                    onClick={() => navigate(`/habit/${habit.id}`)}
                    className={`bg-white rounded-2xl p-4 shadow-md border-2 cursor-pointer transition-all ${
                      habit.completadoHoy ? "border-green-400 bg-green-50" : "border-transparent hover:border-violet-200"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryColors[cat] || categoryColors.ejercicio} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{habit.nombre}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-lg ${categoryBgColors[cat] || "bg-gray-100"} ${categoryTextColors[cat] || "text-gray-700"} font-medium`}>
                            {habit.categoria}
                          </span>
                          <span className="text-xs text-gray-500">🔥 {habit.rachaActual} días</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => toggleHabit(e, habit)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                          habit.completadoHoy ? "bg-green-500" : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {habit.completadoHoy
                          ? <Check className="w-6 h-6 text-white" />
                          : <div className="w-5 h-5 rounded-lg border-2 border-gray-400"></div>
                        }
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredHabits.length === 0 && !cargando && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {selectedCategory === "Todos" ? "¡Aún no tienes hábitos!" : "No hay hábitos en esta categoría"}
                  </p>
                  {selectedCategory !== "Todos" ? (
                    <Button
                      onClick={() => setSelectedCategory("Todos")}
                      className="mt-4 bg-gradient-to-r from-violet-600 to-orange-500"
                    >
                      Ver todos
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate("/add-habit")}
                      className="mt-4 bg-gradient-to-r from-violet-600 to-orange-500"
                    >
                      Crear mi primer hábito
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <BottomNav />

      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        streak={celebrationHabit?.rachaActual + 1 || 1}
        habitName={celebrationHabit?.nombre || ""}
      />
    </div>
  );
}