import { useState, useEffect } from "react";
import { BottomNav } from "./BottomNav";
import { useNavigate } from "react-router";
import { User, Settings, Bell, HelpCircle, LogOut, ChevronRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export function Profile() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<any>(null);
  const [habitos, setHabitos] = useState<any[]>([]);
  const [totalCompletados, setTotalCompletados] = useState(0);
  const [tasaExito, setTasaExito] = useState(0);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const usuarioGuardado = localStorage.getItem("usuario");
      if (!usuarioGuardado) { navigate("/"); return; }
      const u = JSON.parse(usuarioGuardado);
      setUsuario(u);

      const resHabitos = await fetch(`${API_URL}/habitos/usuario/${u.id}`);
      const habitosData = await resHabitos.json();
      setHabitos(habitosData);

      const todosRegistros = await Promise.all(
        habitosData.map((h: any) =>
          fetch(`${API_URL}/registros/habito/${h.id}`).then((r) => r.json())
        )
      );
      const registros = todosRegistros.flat();
      const completados = registros.filter((r: any) => r.completado).length;
      setTotalCompletados(completados);
      setTasaExito(
        habitosData.length > 0
          ? Math.round((completados / (habitosData.length * 30)) * 100)
          : 0
      );
    } catch (e) {
      console.error("Error cargando perfil", e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  const menuItems = [
    { icon: Settings, label: "Configuración", action: () => navigate("/settings") },
    { icon: Bell, label: "Notificaciones", action: () => navigate("/notifications") },
    { icon: HelpCircle, label: "Ayuda y soporte", action: () => navigate("/help") },
  ];

  return (
<div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-violet-600 to-orange-500 rounded-b-3xl shadow-xl p-6 pb-8">
          <h1 className="text-white text-2xl font-bold mb-6">Mi Perfil</h1>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center mx-auto mb-3">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-white text-xl font-bold">{usuario?.nombre || "Usuario"}</h2>
            <p className="text-white/80 text-sm">{usuario?.email || ""}</p>
            <div className="flex gap-4 justify-center mt-4">
              <div className="text-center">
                <p className="text-white text-2xl font-bold">{habitos.length}</p>
                <p className="text-white/80 text-xs">Hábitos</p>
              </div>
              <div className="w-px bg-white/30"></div>
              <div className="text-center">
                <p className="text-white text-2xl font-bold">{totalCompletados}</p>
                <p className="text-white/80 text-xs">Completados</p>
              </div>
              <div className="w-px bg-white/30"></div>
              <div className="text-center">
                <p className="text-white text-2xl font-bold">{tasaExito}%</p>
                <p className="text-white/80 text-xs">Éxito</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.action}
                className="w-full bg-white  dark:bg-gray-900  dark:shadow-gray-900 rounded-2xl p-4 shadow-md flex items-center justify-between hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center dark:from-violet-900/50 dark:to-purple-900/50">
                    <Icon className="w-5 h-5 text-violet-600 dark:text-violet-300" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-300">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            );
          })}

          <button
            onClick={handleLogout}
            className="w-full bg-white dark:bg-gray-900  dark:shadow-gray-900 rounded-2xl p-4 shadow-md flex items-center justify-between hover:shadow-lg transition-shadow border-2 border-red-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>
              <span className="font-medium text-red-600">Cerrar sesión</span>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400" />
          </button>
        </div>

        <div className="px-6 text-center text-gray-400 text-xs space-y-1">
          <p>HabitTracker v1.0.0</p>
          <p>Hecho con ❤️ para construir mejores hábitos</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}