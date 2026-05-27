import { useState, useEffect } from "react";
import { BottomNav } from "./BottomNav";
import { useNavigate } from "react-router";
import { Settings, Bell, HelpCircle, LogOut, ChevronRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const avatares = [
  "🧑", "👩", "👨", "🧒", "👧", "👦",
  "🧔", "👩‍🦰", "👩‍🦱", "👩‍🦳", "👩‍🦲", "🧕",
  "🦸", "🦹", "🧙", "🧝", "🧛", "🤖",
  "🐶", "🐱", "🦊", "🐻", "🐼", "🦁",
];

export function Profile() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<any>(null);
  const [habitos, setHabitos] = useState<any[]>([]);
  const [totalCompletados, setTotalCompletados] = useState(0);
  const [tasaExito, setTasaExito] = useState(0);
  const [avatarSeleccionado, setAvatarSeleccionado] = useState("🧑");
  const [mostrarAvatares, setMostrarAvatares] = useState(false);

  useEffect(() => {
    cargarDatos();
    const avatarGuardado = localStorage.getItem("avatar");
    if (avatarGuardado) setAvatarSeleccionado(avatarGuardado);
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

  const seleccionarAvatar = (avatar: string) => {
    setAvatarSeleccionado(avatar);
    localStorage.setItem("avatar", avatar);
    setMostrarAvatares(false);
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

      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-orange-500 rounded-b-3xl shadow-xl p-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-2xl font-bold mb-6">Mi Perfil</h1>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="relative inline-block mb-3">
              <div className="w-36 h-36 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-7xl border-4 border-white/50">
                {avatarSeleccionado}
              </div>
              <div
                onClick={() => setMostrarAvatares(!mostrarAvatares)}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm shadow-md hover:bg-gray-100 transition-all cursor-pointer"
              >
                ✏️
              </div>
            </div>
            <h2 className="text-white text-xl font-bold mt-2">{usuario?.nombre || "Usuario"}</h2>
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
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6">

          {/* Columna izquierda */}
          <div className="flex-1 space-y-4">

            {/* Selector de avatares */}
            {mostrarAvatares && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">Elige tu avatar</h3>
                  <div
                    onClick={() => setMostrarAvatares(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer"
                  >✕</div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {avatares.map((avatar) => (
                    <div
                      key={avatar}
                      onClick={() => seleccionarAvatar(avatar)}
                      className={`w-16 h-16 rounded-xl text-4xl flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${
                        avatarSeleccionado === avatar
                          ? "bg-gradient-to-br from-violet-500 to-orange-500 shadow-lg scale-110"
                          : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {avatar}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Menú */}
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  onClick={item.action}
                  className="w-full bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-md flex items-center justify-between hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-violet-600" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              );
            })}

            <div
              onClick={handleLogout}
              className="w-full bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-md flex items-center justify-between hover:shadow-lg transition-shadow border-2 border-red-100 dark:border-red-900 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <span className="font-medium text-red-600">Cerrar sesión</span>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400" />
            </div>
          </div>

          {/* Columna derecha — solo PC */}
          <div className="hidden md:flex flex-col gap-4 w-64">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md text-center">
              <div className="text-6xl mb-4">{avatarSeleccionado}</div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100">{usuario?.nombre}</h3>
              <p className="text-gray-500 text-sm mt-1">{usuario?.email}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md space-y-3">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Estadísticas</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Hábitos</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{habitos.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Completados</span>
                <span className="font-bold text-green-600">{totalCompletados}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tasa de éxito</span>
                <span className="font-bold text-violet-600">{tasaExito}%</span>
              </div>
            </div>
            <div className="text-center text-gray-400 text-xs space-y-1">
              <p>HabitTracker v1.0.0</p>
              <p>Hecho con ❤️ para construir mejores hábitos</p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}