import { useState, useEffect } from "react";
import { BottomNav } from "./BottomNav";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Cell,
} from "recharts";
import { Trophy, TrendingUp, Target, Award } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export function Stats() {
  const [habitos, setHabitos] = useState<any[]>([]);
  const [registros, setRegistros] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const usuarioGuardado = localStorage.getItem("usuario");
      if (!usuarioGuardado) return;
      const usuario = JSON.parse(usuarioGuardado);

      const resHabitos = await fetch(`${API_URL}/habitos/usuario/${usuario.id}`);
      const habitosData = await resHabitos.json();
      setHabitos(habitosData);

      // Obtener registros de todos los hábitos
      const todosRegistros = await Promise.all(
        habitosData.map((h: any) =>
          fetch(`${API_URL}/registros/habito/${h.id}`)
            .then((r) => r.json())
            .then((regs) => regs.map((r: any) => ({ ...r, habitoNombre: h.nombre, habitoId: h.id })))
        )
      );
      setRegistros(todosRegistros.flat());
    } catch (e) {
      console.error("Error cargando estadísticas", e);
    } finally {
      setCargando(false);
    }
  };

  // Datos para gráfica semanal
  const getWeeklyData = () => {
    const dias = ["L", "M", "M", "J", "V", "S", "D"];
    const hoy = new Date();
    const diaSemana = hoy.getDay();
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));

    return dias.map((dia, i) => {
      const fecha = new Date(lunes);
      fecha.setDate(lunes.getDate() + i);
      const fechaStr = fecha.toISOString().split("T")[0];
      const count = registros.filter((r) => r.fecha === fechaStr && r.completado).length;
      return { day: dia, count };
    });
  };

  // Mapa de calor (últimos 42 días)
  const getHeatmapData = () => {
    const data = [];
    const hoy = new Date();
    for (let i = 41; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() - i);
      const fechaStr = fecha.toISOString().split("T")[0];
      const count = registros.filter((r) => r.fecha === fechaStr && r.completado).length;
      const intensity = count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : 3;
      data.push({ fechaStr, intensity });
    }
    return data;
  };

  // Top hábitos por completaciones
  const getTopHabits = () => {
    const colores = [
      "from-green-400 to-emerald-500",
      "from-purple-400 to-violet-500",
      "from-orange-400 to-orange-600",
    ];
    return habitos
      .map((h) => ({
        name: h.nombre,
        completions: registros.filter((r) => r.habitoId === h.id && r.completado).length,
        color: colores[habitos.indexOf(h) % colores.length],
      }))
      .sort((a, b) => b.completions - a.completions)
      .slice(0, 3);
  };

  const totalCompletados = registros.filter((r) => r.completado).length;
  const tasaExito = habitos.length > 0
    ? Math.round((totalCompletados / (habitos.length * 30)) * 100)
    : 0;

  const weeklyData = getWeeklyData();
  const heatmapData = getHeatmapData();
  const topHabits = getTopHabits();
  const maxCompletions = Math.max(...topHabits.map((h) => h.completions), 1);

  const getHeatmapColor = (intensity: number) => {
    return ["bg-gray-100", "bg-violet-200", "bg-violet-400", "bg-violet-600"][intensity];
  };

  if (cargando) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Cargando estadísticas...</p>
    </div>
  );

  return (
<div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-violet-600 to-orange-500 rounded-b-3xl shadow-xl p-6 pb-8">
          <h1 className="text-white text-2xl font-bold mb-2">Estadísticas</h1>
          <p className="text-white/80 text-sm">Tu progreso en los últimos 30 días</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Total</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalCompletados}</p>
              <p className="text-xs text-gray-400">hábitos completados</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Promedio</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{tasaExito}%</p>
              <p className="text-xs text-gray-400">tasa de éxito</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-violet-600" />
              <h2 className="font-bold text-gray-900">Semana actual</h2>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weeklyData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#666" }} axisLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#666" }} axisLine={false} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {weeklyData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "url(#grad1)" : "url(#grad2)"} />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#A78BFA" />
                  </linearGradient>
                  <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FB923C" />
                    <stop offset="100%" stopColor="#FDBA74" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-violet-600" />
              <h2 className="font-bold text-gray-900">Mapa de actividad</h2>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {heatmapData.map((day, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded ${getHeatmapColor(day.intensity)}`}
                  title={`${day.fechaStr}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
              <span>Menos</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded bg-gray-100" />
                <div className="w-3 h-3 rounded bg-violet-200" />
                <div className="w-3 h-3 rounded bg-violet-400" />
                <div className="w-3 h-3 rounded bg-violet-600" />
              </div>
              <span>Más</span>
            </div>
          </div>

          {topHabits.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-violet-600" />
                <h2 className="font-bold text-gray-900">Hábitos destacados</h2>
              </div>
              <div className="space-y-4">
                {topHabits.map((habit, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${habit.color} flex items-center justify-center text-white font-bold text-sm`}>
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-900">{habit.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-violet-600">{habit.completions}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${habit.color} rounded-full`}
                        style={{ width: `${(habit.completions / maxCompletions) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {totalCompletados >= 10 && (
            <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-orange-500 rounded-2xl p-6 text-center shadow-xl">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 space-y-3">
                <div className="text-5xl">🏆</div>
                <h3 className="text-white font-bold text-lg">¡Excelente progreso!</h3>
                <p className="text-white/90 text-sm">
                  Has completado {totalCompletados} hábitos en total. ¡Sigue así!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}