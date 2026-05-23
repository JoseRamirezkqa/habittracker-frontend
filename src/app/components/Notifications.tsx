import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "./BottomNav";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft, Bell, Dumbbell, Book, Heart, Briefcase, Droplet, Moon } from "lucide-react";

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

export function Notifications() {
  const navigate = useNavigate();
  const [globalEnabled, setGlobalEnabled] = useState(
    localStorage.getItem("notificacionesGlobal") !== "false"
  );
  const [habitosAntesDeDesactivar, setHabitosAntesDeDesactivar] = useState<number[]>(
    JSON.parse(localStorage.getItem("habitosActivos") || "[]")
  );
  const [habitos, setHabitos] = useState<any[]>([]);

  useEffect(() => {
    cargarHabitos();
  }, []);

  const cargarHabitos = async () => {
    try {
      const usuarioGuardado = localStorage.getItem("usuario");
      if (!usuarioGuardado) { navigate("/"); return; }
      const u = JSON.parse(usuarioGuardado);
      const res = await fetch(`${API_URL}/habitos/usuario/${u.id}`);
      const data = await res.json();
      setHabitos(data.map((h: any) => ({
        ...h,
        notificacionActiva: !!h.horaRecordatorio,
        horaRecordatorio: h.horaRecordatorio || "08:00",
      })));
    } catch (e) {
      console.error("Error cargando hábitos", e);
    }
  };

  const toggleGlobal = (valor: boolean) => {
    setGlobalEnabled(valor);
    localStorage.setItem("notificacionesGlobal", String(valor));

    if (!valor) {
      // Guardar cuáles tenían notificación activa antes de desactivar
      const activos = habitos.filter((h) => h.notificacionActiva).map((h) => h.id);
      setHabitosAntesDeDesactivar(activos);
      localStorage.setItem("habitosActivos", JSON.stringify(activos));
    } else {
      // Restaurar los que tenían notificación activa
      const guardados = JSON.parse(localStorage.getItem("habitosActivos") || "[]");
      setHabitosAntesDeDesactivar(guardados);
      // Reactivar notificaciones en los hábitos que las tenían
      setHabitos((prev) =>
        prev.map((h) => guardados.includes(h.id) ? { ...h, notificacionActiva: true } : h)
      );
    }
  };

  const toggleNotificacion = async (id: number) => {
    const habito = habitos.find((h) => h.id === id);
    if (!habito) return;

    const nuevaActiva = !habito.notificacionActiva;
    const nuevaHora = nuevaActiva ? habito.horaRecordatorio : null;

    setHabitos((prev) =>
      prev.map((h) => h.id === id ? { ...h, notificacionActiva: nuevaActiva } : h)
    );

    // Actualizar lista de activos en localStorage
    const activos = habitos
      .map((h) => h.id === id ? { ...h, notificacionActiva: nuevaActiva } : h)
      .filter((h) => h.notificacionActiva)
      .map((h) => h.id);
    localStorage.setItem("habitosActivos", JSON.stringify(activos));

    try {
      await fetch(`${API_URL}/habitos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...habito, horaRecordatorio: nuevaHora }),
      });
    } catch (e) {
      console.error("Error actualizando notificación", e);
    }
  };

  const updateHora = async (id: number, hora: string) => {
    setHabitos((prev) =>
      prev.map((h) => h.id === id ? { ...h, horaRecordatorio: hora } : h)
    );
    try {
      const habito = habitos.find((h) => h.id === id);
      await fetch(`${API_URL}/habitos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...habito, horaRecordatorio: hora }),
      });
    } catch (e) {
      console.error("Error actualizando hora", e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-orange-50 pb-24">
      <div className="max-w-[375px] mx-auto">
        <div className="bg-gradient-to-r from-violet-600 to-orange-500 rounded-b-3xl shadow-xl p-6 pb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white mb-6 hover:opacity-80">
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">Notificaciones</h1>
              <p className="text-white/80 text-sm mt-1">Gestiona tus recordatorios</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">Activar notificaciones</p>
                <p className="text-sm text-gray-500 mt-1">Recibe recordatorios para tus hábitos</p>
              </div>
              <Switch checked={globalEnabled} onCheckedChange={toggleGlobal} />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 px-1">Por hábito</h2>
            {habitos.map((habito) => {
              const Icon = iconMap[habito.icono] || Dumbbell;
              const cat = habito.categoria?.toLowerCase() || "ejercicio";
              const estaActivo = globalEnabled
                ? habito.notificacionActiva
                : habitosAntesDeDesactivar.includes(habito.id);

              return (
                <div key={habito.id} className={`bg-white rounded-2xl p-4 shadow-md ${!globalEnabled ? "opacity-50" : ""}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryColors[cat] || categoryColors.ejercicio} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{habito.nombre}</h3>
                          <p className="text-xs text-gray-500">{habito.categoria}</p>
                        </div>
                        <Switch
                          checked={estaActivo && globalEnabled}
                          onCheckedChange={() => toggleNotificacion(habito.id)}
                          disabled={!globalEnabled}
                        />
                      </div>
                      {habito.notificacionActiva && globalEnabled && (
                        <div className="space-y-2">
                          <Label className="text-sm text-gray-600">Hora del recordatorio</Label>
                          <Input
                            type="time"
                            value={habito.horaRecordatorio}
                            onChange={(e) => updateHora(habito.id, e.target.value)}
                            className="h-10 rounded-xl border-gray-200"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {habitos.length === 0 && (
              <p className="text-center text-gray-500 py-8">No tienes hábitos configurados aún</p>
            )}
          </div>

          <div className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-2xl p-6 border border-violet-200">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="font-semibold text-violet-900 mb-1">💡 Consejo</p>
                <p className="text-sm text-violet-800">
                  Las notificaciones te ayudan a mantener la constancia. Configura recordatorios en momentos del día que mejor se adapten a tu rutina.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}