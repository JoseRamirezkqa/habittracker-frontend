import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { CelebrationModal } from "./CelebrationModal";
import { ArrowLeft, Dumbbell, Book, Heart, Briefcase, Droplet, Moon, Flame, Trophy, Calendar, Pencil } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const iconMap: Record<string, any> = {
  dumbbell: Dumbbell, book: Book, heart: Heart,
  briefcase: Briefcase, droplet: Droplet, moon: Moon,
};

const categoryColors: Record<string, string> = {
  salud: "from-green-400 to-emerald-500",
  productividad: "from-blue-400 to-blue-600",
  bienestar: "from-purple-400 to-violet-500",
  ejercicio: "from-orange-400 to-orange-600",
  mindfulness: "from-pink-400 to-pink-600",
};

export function HabitDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [habito, setHabito] = useState<any>(null);
  const [completadoHoy, setCompletadoHoy] = useState(false);
  const [registrosSemana, setRegistrosSemana] = useState<any[]>([]);
  const [note, setNote] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      const [resHabito, resHoy, resSemana] = await Promise.all([
        fetch(`${API_URL}/habitos/${id}`),
        fetch(`${API_URL}/registros/habito/${id}/hoy`),
        fetch(`${API_URL}/registros/habito/${id}/semana`),
      ]);
      const habitoData = await resHabito.json();
      const hoyData = await resHoy.json();
      const semanaData = await resSemana.json();
      setHabito(habitoData);
      setCompletadoHoy(hoyData);
      setRegistrosSemana(semanaData);
    } catch (e) {
      console.error("Error cargando datos", e);
    } finally {
      setCargando(false);
    }
  };

  const handleComplete = async () => {
    if (completadoHoy) return;
    try {
      await fetch(`${API_URL}/registros/completar/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notas: note }),
      });
      setCompletadoHoy(true);
      setHabito((prev: any) => ({
        ...prev,
        rachaActual: prev.rachaActual + 1,
        mejorRacha: Math.max(prev.mejorRacha, prev.rachaActual + 1),
      }));
      setShowCelebration(true);
    } catch (e) {
      console.error("Error marcando hábito", e);
    }
  };

  const getDiasSemana = () => {
    const dias = ["L", "M", "M", "J", "V", "S", "D"];
    const hoy = new Date();
    const diaSemana = hoy.getDay();
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));

    return dias.map((dia, i) => {
      const fecha = new Date(lunes);
      fecha.setDate(lunes.getDate() + i);
      const fechaStr = fecha.toISOString().split("T")[0];
      const completado = registrosSemana.some((r) => r.fecha === fechaStr && r.completado);
      return { dia, fecha: fecha.getDate(), completado, esFuturo: fecha > hoy };
    });
  };

  if (cargando) return (
    <div className="flex items-center justify-center min-h-screen dark:bg-gray-950">
      <p className="text-gray-500 dark:text-gray-400">Cargando...</p>
    </div>
  );
  if (!habito) return (
    <div className="flex items-center justify-center min-h-screen dark:bg-gray-950">
      <p className="text-gray-500 dark:text-gray-400">Hábito no encontrado</p>
    </div>
  );

  const Icon = iconMap[habito.icono] || Dumbbell;
  const diasSemana = getDiasSemana();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-[375px] mx-auto pb-8">
        <div className="bg-gradient-to-r from-violet-600 to-orange-500 rounded-b-3xl shadow-xl p-6 pb-8">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-white hover:opacity-80">
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>
            <button onClick={() => navigate(`/edit-habit/${id}`)} className="text-white hover:opacity-80">
              <Pencil className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">{habito.nombre}</h1>
              <span className="text-xs px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-white font-medium inline-block mt-2">
                {habito.categoria}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Calendario semanal */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-violet-600" />
              <h2 className="font-bold text-gray-900 dark:text-gray-100">Esta semana</h2>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {diasSemana.map((d, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{d.dia}</span>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold ${
                    d.completado
                      ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-md"
                      : d.esFuturo
                      ? "bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                  }`}>
                    {d.completado ? "✓" : d.fecha}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botón completar */}
          <Button
            onClick={handleComplete}
            disabled={completadoHoy}
            className={`w-full h-16 text-lg font-bold rounded-2xl shadow-lg ${
              completadoHoy
                ? "bg-green-500 hover:bg-green-500 cursor-not-allowed"
                : "bg-gradient-to-r from-violet-600 to-orange-500"
            }`}
          >
            {completadoHoy ? "✓ Completado hoy" : "Marcar como completado hoy"}
          </Button>

          {/* Notas */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md space-y-3">
            <h3 className="font-bold text-gray-900 dark:text-gray-100">Notas (opcional)</h3>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="¿Cómo te sentiste hoy?"
              className="min-h-24 rounded-xl resize-none border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
              disabled={completadoHoy}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md text-center">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Racha actual</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                {habito.rachaActual}
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs">días</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md text-center">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Mejor racha</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-purple-700 bg-clip-text text-transparent">
                {habito.mejorRacha}
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs">días</p>
            </div>
          </div>
        </div>
      </div>

      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        streak={habito.rachaActual}
        habitName={habito.nombre}
      />
    </div>
  );
}