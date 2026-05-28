import { useState, useEffect } from "react";
import { BottomNav } from "./BottomNav";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Cell, Tooltip,
} from "recharts";
import { Trophy, TrendingUp, Target, Award, Flame, CheckCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export function Stats() {
  const [habitos, setHabitos] = useState<any[]>([]);
  const [registros, setRegistros] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    cargarDatos();
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const cargarDatos = async () => {
    try {
      const usuarioGuardado = localStorage.getItem("usuario");
      if (!usuarioGuardado) return;
      const usuario = JSON.parse(usuarioGuardado);
      const resHabitos = await fetch(`${API_URL}/habitos/usuario/${usuario.id}`);
      const habitosData = await resHabitos.json();
      setHabitos(habitosData);
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

  const getWeeklyData = () => {
    const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const hoy = new Date();
    const diaSemana = hoy.getDay();
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));
    return dias.map((dia, i) => {
      const fecha = new Date(lunes);
      fecha.setDate(lunes.getDate() + i);
      const fechaStr = fecha.toISOString().split("T")[0];
      const count = registros.filter((r) => r.fecha === fechaStr && r.completado).length;
      const esFuturo = fecha > hoy;
      return { day: dia, count: esFuturo ? 0 : count, esFuturo };
    });
  };

  const getHeatmapData = () => {
    const data = [];
    const hoy = new Date();
    for (let i = 41; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() - i);
      const fechaStr = fecha.toISOString().split("T")[0];
      const count = registros.filter((r) => r.fecha === fechaStr && r.completado).length;
      const intensity = count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : 3;
      data.push({ fechaStr, intensity, count });
    }
    return data;
  };

  const getTopHabits = () => {
    const colores = [
      "from-orange-400 to-orange-600",
      "from-violet-400 to-violet-600",
      "from-green-400 to-emerald-500",
    ];
    return habitos
      .map((h) => ({
        name: h.nombre,
        completions: registros.filter((r) => r.habitoId === h.id && r.completado).length,
        racha: h.rachaActual,
        color: colores[habitos.indexOf(h) % colores.length],
      }))
      .sort((a, b) => b.completions - a.completions)
      .slice(0, 3);
  };

  const totalCompletados = registros.filter((r) => r.completado).length;
  const completadosEstaSemana = getWeeklyData().reduce((sum, d) => sum + d.count, 0);
  const mejorRacha = habitos.length > 0 ? Math.max(...habitos.map(h => h.mejorRacha || 0)) : 0;
  const rachaActual = habitos.length > 0 ? Math.max(...habitos.map(h => h.rachaActual || 0)) : 0;
  const tasaExito = habitos.length > 0
    ? Math.round((totalCompletados / Math.max(habitos.length * 30, 1)) * 100)
    : 0;

  const weeklyData = getWeeklyData();
  const heatmapData = getHeatmapData();
  const topHabits = getTopHabits();
  const maxCompletions = Math.max(...topHabits.map((h) => h.completions), 1);

  const getHeatmapColor = (intensity: number) => {
    if (isDark) return ["bg-gray-800", "bg-violet-900", "bg-violet-600", "bg-violet-400"][intensity];
    return ["bg-gray-100", "bg-violet-200", "bg-violet-400", "bg-violet-600"][intensity];
  };

  const chartGridColor = isDark ? "#374151" : "#f0f0f0";
  const chartTickColor = isDark ? "#9CA3AF" : "#666";

  if (cargando) return (
    <div className="flex items-center justify-center min-h-screen dark:bg-gray-950">
      <p className="text-gray-500 dark:text-gray-400">Cargando estadísticas...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-24">

      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-orange-500 shadow-xl p-6 pb-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-white text-3xl font-bold mb-1">Estadísticas</h1>
          <p className="text-white/80 text-sm">Tu progreso y rendimiento</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-6">

        {/* Tarjetas resumen — 4 métricas clave */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-md text-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalCompletados}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total completados</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-md text-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mx-auto mb-2">
              <Target className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{completadosEstaSemana}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Esta semana</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-md text-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center mx-auto mb-2">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{rachaActual}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Racha actual</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-md text-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{mejorRacha}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Mejor racha</p>
          </div>
        </div>

        {/* Layout dos columnas en PC */}
        <div className="flex flex-col md:flex-row gap-6">

          {/* Columna izquierda */}
          <div className="flex-1 space-y-6">

            {/* Gráfica semanal */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-violet-600" />
                  <h2 className="font-bold text-gray-900 dark:text-gray-100">Hábitos por día esta semana</h2>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
                  {completadosEstaSemana} completados
                </span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={weeklyData} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: chartTickColor }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: chartTickColor }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    formatter={(value: any) => [`${value} hábitos`, "Completados"]}
                    contentStyle={{
                      backgroundColor: isDark ? "#1f2937" : "#fff",
                      border: "none",
                      borderRadius: "12px",
                      color: isDark ? "#f3f4f6" : "#111",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={40}>
                    {weeklyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.esFuturo ? (isDark ? "#374151" : "#e5e7eb") : index % 2 === 0 ? "url(#grad1)" : "url(#grad2)"}
                      />
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

            {/* Hábitos destacados */}
            {topHabits.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-violet-600" />
                  <h2 className="font-bold text-gray-900 dark:text-gray-100">Hábitos más completados</h2>
                </div>
                <div className="space-y-4">
                  {topHabits.map((habit, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${habit.color} flex items-center justify-center text-white font-bold text-sm`}>
                            {index + 1}
                          </div>
                          <div>
                            <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">{habit.name}</span>
                            <p className="text-xs text-gray-400">🔥 Racha: {habit.racha} días</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-violet-600 dark:text-violet-400">
                          {habit.completions} veces
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                        <div
                          className={`h-full bg-gradient-to-r ${habit.color} rounded-full transition-all`}
                          style={{ width: `${(habit.completions / maxCompletions) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha */}
          <div className="flex flex-col gap-6 md:w-72">

            {/* Tasa de éxito */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md text-center">
              <div className="flex items-center gap-2 mb-4 justify-center">
                <TrendingUp className="w-5 h-5 text-violet-600" />
                <h2 className="font-bold text-gray-900 dark:text-gray-100">Tasa de éxito</h2>
              </div>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={isDark ? "#374151" : "#e5e7eb"}
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#circleGrad)"
                    strokeWidth="3"
                    strokeDasharray={`${Math.min(tasaExito, 100)}, 100`}
                  />
                  <defs>
                    <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#FB923C" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{tasaExito}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {tasaExito >= 80 ? "🌟 ¡Excelente!" : tasaExito >= 50 ? "💪 ¡Buen trabajo!" : "🚀 ¡Sigue adelante!"}
              </p>
            </div>

            {/* Mapa de calor compacto */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-violet-600" />
                <h2 className="font-bold text-gray-900 dark:text-gray-100">Actividad (6 semanas)</h2>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {["L","M","M","J","V","S","D"].map(d => (
                  <div key={d} className="text-center text-xs text-gray-400 mb-1">{d}</div>
                ))}
                {heatmapData.map((day, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-sm ${getHeatmapColor(day.intensity)}`}
                    title={`${day.fechaStr}: ${day.count} hábitos`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                <span>Menos</span>
                <div className="flex gap-1">
                  {[0,1,2,3].map(i => (
                    <div key={i} className={`w-3 h-3 rounded-sm ${getHeatmapColor(i)}`} />
                  ))}
                </div>
                <span>Más</span>
              </div>
            </div>

            {/* Mensaje motivacional */}
            {totalCompletados >= 5 && (
              <div className="bg-gradient-to-br from-violet-500 to-orange-500 rounded-2xl p-5 text-center shadow-xl">
                <div className="text-4xl mb-2">🏆</div>
                <h3 className="text-white font-bold">¡Excelente progreso!</h3>
                <p className="text-white/90 text-sm mt-1">
                  Has completado {totalCompletados} hábitos en total.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}