import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "./BottomNav";
import { Button } from "./ui/button";
import {
  Dumbbell, Book, Heart, Briefcase, Droplet,
  Moon, Plus, Pencil, Trash2, Flame, Trophy,
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
  salud: "bg-green-100 dark:bg-green-950",
  productividad: "bg-blue-100 dark:bg-blue-950",
  bienestar: "bg-purple-100 dark:bg-purple-950",
  ejercicio: "bg-orange-100 dark:bg-orange-950",
  mindfulness: "bg-pink-100 dark:bg-pink-950",
};

const categoryTextColors: Record<string, string> = {
  salud: "text-green-700 dark:text-green-300",
  productividad: "text-blue-700 dark:text-blue-300",
  bienestar: "text-purple-700 dark:text-purple-300",
  ejercicio: "text-orange-700 dark:text-orange-300",
  mindfulness: "text-pink-700 dark:text-pink-300",
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
      setHabits(data);
    } catch (e) {
      console.error("Error cargando hábitos", e);
    } finally {
      setCargando(false);
    }
  };

  const eliminarHabito = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!window.confirm("¿Eliminar este hábito?")) return;
    try {
      await fetch(`${API_URL}/habitos/${id}`, { method: "DELETE" });
      setHabits((prev) => prev.filter((h) => h.id !== id));
    } catch (e) {
      console.error("Error eliminando hábito", e);
    }
  };

  const filteredHabits = selectedCategory === "Todos"
    ? habits
    : habits.filter((h) => h.categoria?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-24">

      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-orange-500 shadow-xl p-6 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-white text-3xl font-bold">Mis Hábitos</h1>
              <p className="text-white/80 text-sm mt-1">{habits.length} hábitos registrados en total</p>
            </div>
            <Button
              onClick={() => navigate("/add-habit")}
              className="h-12 px-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold rounded-2xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nuevo hábito
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">

        {/* Filtros por categoría */}
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-violet-600 to-orange-500 text-white shadow-md"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {cargando ? (
          <p className="text-center text-gray-500 py-8">Cargando hábitos...</p>
        ) : filteredHabits.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              {selectedCategory === "Todos" ? "¡Aún no tienes hábitos!" : "No hay hábitos en esta categoría"}
            </p>
            {selectedCategory !== "Todos" ? (
              <Button onClick={() => setSelectedCategory("Todos")} className="bg-gradient-to-r from-violet-600 to-orange-500">
                Ver todos
              </Button>
            ) : (
              <Button onClick={() => navigate("/add-habit")} className="bg-gradient-to-r from-violet-600 to-orange-500">
                <Plus className="w-5 h-5 mr-2" /> Crear mi primer hábito
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHabits.map((habit) => {
              const Icon = iconMap[habit.icono] || Dumbbell;
              const cat = habit.categoria?.toLowerCase() || "ejercicio";
              return (
                <div
                  key={habit.id}
                  onClick={() => navigate(`/habit/${habit.id}`)}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-md cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-violet-200 dark:hover:border-violet-800"
                >
                  {/* Cabecera de la tarjeta */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${categoryColors[cat] || categoryColors.ejercicio} flex items-center justify-center shadow-md`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{habit.nombre}</h3>
                        <span className={`text-xs px-2 py-1 rounded-lg ${categoryBgColors[cat] || "bg-gray-100"} ${categoryTextColors[cat] || "text-gray-700"} font-medium`}>
                          {habit.categoria}
                        </span>
                      </div>
                    </div>

                    {/* Botones editar y eliminar */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/edit-habit/${habit.id}`); }}
                        className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900 hover:bg-violet-200 flex items-center justify-center transition-all"
                      >
                        <Pencil className="w-4 h-4 text-violet-600 dark:text-violet-300" />
                      </button>
                      <button
                        onClick={(e) => eliminarHabito(e, habit.id)}
                        className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900 hover:bg-red-200 flex items-center justify-center transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-300" />
                      </button>
                    </div>
                  </div>

                  {/* Estadísticas del hábito */}
                  <div className="flex gap-3">
                    <div className="flex-1 bg-orange-50 dark:bg-orange-950 rounded-xl p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Racha actual</span>
                      </div>
                      <p className="text-xl font-bold text-orange-500">{habit.rachaActual}</p>
                      <p className="text-xs text-gray-400">días</p>
                    </div>
                    <div className="flex-1 bg-violet-50 dark:bg-violet-950 rounded-xl p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Trophy className="w-4 h-4 text-violet-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Mejor racha</span>
                      </div>
                      <p className="text-xl font-bold text-violet-500">{habit.mejorRacha}</p>
                      <p className="text-xs text-gray-400">días</p>
                    </div>
                    <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Frecuencia</span>
                      </div>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        {habit.frecuencia === "DIARIO" ? "Diario" : "Semanal"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}