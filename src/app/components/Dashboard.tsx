import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "./BottomNav";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import {
  Flame, Dumbbell, Book, Heart, Briefcase,
  Droplet, Moon, Check, Plus, Sparkles, Trash2,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const categoryColors: Record<string, string> = {
  salud: "from-green-400 to-emerald-500",
  productividad: "from-blue-400 to-blue-600",
  bienestar: "from-purple-400 to-violet-500",
  ejercicio: "from-orange-400 to-orange-600",
};

const categoryBgColors: Record<string, string> = {
  salud: "bg-green-100",
  productividad: "bg-blue-100",
  bienestar: "bg-purple-100",
  ejercicio: "bg-orange-100",
};

const categoryTextColors: Record<string, string> = {
  salud: "text-green-700",
  productividad: "text-blue-700",
  bienestar: "text-purple-700",
  ejercicio: "text-orange-700",
};

const iconMap: Record<string, any> = {
  dumbbell: Dumbbell, book: Book, heart: Heart,
  briefcase: Briefcase, droplet: Droplet, moon: Moon,
};

export function Dashboard() {
  const navigate = useNavigate();
  const [habits, setHabits] = useState<any[]>([]);
  const [usuario, setUsuario] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (!usuarioGuardado) { navigate("/"); return; }
    const u = JSON.parse(usuarioGuardado);
    setUsuario(u);
    cargarHabitos(u.id);
  }, []);

  const cargarHabitos = async (usuarioId: number) => {
    try {
      const res = await fetch(`${API_URL}/habitos/usuario/${usuarioId}`);
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

  const toggleHabit = async (id: number, completadoHoy: boolean) => {
    try {
      if (completadoHoy) {
        await fetch(`${API_URL}/registros/desmarcar/${id}`, { method: "DELETE" });
        setHabits((prev) =>
          prev.map((h) => h.id === id ? { ...h, completadoHoy: false, rachaActual: Math.max(0, h.rachaActual - 1) } : h)
        );
      } else {
        await fetch(`${API_URL}/registros/completar/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notas: "" }),
        });
        setHabits((prev) =>
          prev.map((h) => h.id === id ? { ...h, completadoHoy: true, rachaActual: h.rachaActual + 1 } : h)
        );
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    } catch (e) {
      console.error("Error toggling hábito", e);
    }
  };

  const eliminarHabit = async (id: number) => {
    if (!window.confirm("¿Eliminar este hábito?")) return;
    try {
      await fetch(`${API_URL}/habitos/${id}`, { method: "DELETE" });
      setHabits((prev) => prev.filter((h) => h.id !== id));
    } catch (e) {
      console.error("Error eliminando hábito", e);
    }
  };

  const completedCount = habits.filter((h) => h.completadoHoy).length;
  const progressPercentage = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;
  const maxStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.rachaActual)) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-24">

      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-orange-500 shadow-xl p-6 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-white/80 text-sm">¡Hola de nuevo!</p>
              <h1 className="text-white text-3xl font-bold">{usuario?.nombre || "Usuario"}</h1>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3">
                <Flame className="w-6 h-6 text-orange-300" />
                <div>
                  <p className="text-white/80 text-xs">Racha</p>
                  <p className="text-white font-bold">¡{maxStreak} días!</p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3">
                <p className="text-white/80 text-xs">Progreso del día</p>
                <p className="text-white font-bold">{completedCount}/{habits.length} hábitos</p>
              </div>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-white/30 mt-4" />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6">

          {/* Columna izquierda — resumen (solo PC) */}
          <div className="hidden md:flex flex-col gap-4 w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-100 to-orange-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-violet-600">{Math.round(progressPercentage)}%</span>
              </div>
              <p className="text-center text-gray-500 text-sm">Completado hoy</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md space-y-3">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Resumen</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total hábitos</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{habits.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Completados</span>
                <span className="font-bold text-green-600">{completedCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Pendientes</span>
                <span className="font-bold text-orange-500">{habits.length - completedCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Racha máxima</span>
                <span className="font-bold text-violet-600">{maxStreak} días</span>
              </div>
            </div>
            <Button
              onClick={() => navigate("/add-habit")}
              className="w-full h-12 bg-gradient-to-r from-violet-600 to-orange-500 text-white font-bold rounded-2xl"
            >
              <Plus className="w-5 h-5 mr-2" /> Nuevo hábito
            </Button>
          </div>

          {/* Columna derecha — lista de hábitos */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Hábitos de hoy</h2>
              <Button
                onClick={() => navigate("/add-habit")}
                className="md:hidden rounded-full w-10 h-10 p-0 bg-gradient-to-r from-violet-600 to-orange-500"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            {cargando ? (
              <p className="text-center text-gray-500 py-8">Cargando hábitos...</p>
            ) : habits.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 shadow-md text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-100 to-orange-100 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-violet-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">¡Aún no tienes hábitos!</h3>
                  <p className="text-gray-600 dark:text-gray-400">Crea tu primer hábito y comienza a construir una mejor versión de ti.</p>
                </div>
                <Button
                  onClick={() => navigate("/add-habit")}
                  className="w-full h-14 bg-gradient-to-r from-violet-600 to-orange-500 text-white font-bold rounded-2xl"
                >
                  <Plus className="w-6 h-6 mr-2" /> Crear mi primer hábito
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {habits.map((habit) => {
                  const Icon = iconMap[habit.icono] || Dumbbell;
                  const cat = habit.categoria?.toLowerCase() || "ejercicio";
                  return (
                    <div
                      key={habit.id}
                      onClick={() => navigate(`/habit/${habit.id}`)}
                      className={`bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-md border-2 cursor-pointer transition-all ${
                        habit.completadoHoy ? "border-green-400 bg-green-50 dark:bg-green-950" : "border-transparent hover:border-violet-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryColors[cat] || categoryColors.ejercicio} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{habit.nombre}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-lg ${categoryBgColors[cat] || "bg-gray-100"} ${categoryTextColors[cat] || "text-gray-700"} font-medium`}>
                              {habit.categoria}
                            </span>
                            <span className="text-xs text-gray-500">🔥 {habit.rachaActual} días</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleHabit(habit.id, habit.completadoHoy); }}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                              habit.completadoHoy ? "bg-green-500" : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
                            }`}
                          >
                            {habit.completadoHoy
                              ? <Check className="w-6 h-6 text-white" />
                              : <div className="w-5 h-5 rounded-lg border-2 border-gray-400"></div>
                            }
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); eliminarHabit(habit.id); }}
                            className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-100 dark:bg-red-950 hover:bg-red-200 transition-all"
                          >
                            <Trash2 className="w-5 h-5 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-6" onClick={() => setShowCelebration(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-8 text-center shadow-2xl w-full max-w-sm">
            <p className="text-5xl mb-4">🎉</p>
            <p className="text-gray-900 dark:text-gray-100 font-bold text-xl mb-2">¡Racha activa!</p>
            <p className="text-gray-500 text-sm">¡Sigue así, lo estás haciendo genial!</p>
            <button
              onClick={() => setShowCelebration(false)}
              className="mt-6 w-full py-3 bg-gradient-to-r from-violet-600 to-orange-500 text-white font-bold rounded-2xl"
            >
              ¡Genial!
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}