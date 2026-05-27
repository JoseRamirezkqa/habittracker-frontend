import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "./BottomNav";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { ArrowLeft, Moon, Globe, User, LogOut, Bell, ChevronRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export function Settings() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("es");
  const [userName, setUserName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (!usuarioGuardado) { navigate("/"); return; }
    const u = JSON.parse(usuarioGuardado);
    setUsuario(u);
    setUserName(u.nombre);
    setDarkMode(localStorage.getItem("darkMode") === "true");
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  const handleSaveName = async () => {
    try {
      const res = await fetch(`${API_URL}/usuarios/${usuario.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...usuario, nombre: userName }),
      });
      const updated = await res.json();
      localStorage.setItem("usuario", JSON.stringify(updated));
      setUsuario(updated);
      setIsEditingName(false);
    } catch (e) {
      console.error("Error actualizando nombre", e);
    }
  };

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      localStorage.removeItem("usuario");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-24">

      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-orange-500 rounded-b-3xl shadow-xl p-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate("/profile")} className="flex items-center gap-2 text-white mb-6 hover:opacity-80">
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <h1 className="text-white text-2xl font-bold">Configuración</h1>
          <p className="text-white/80 text-sm mt-2">Personaliza tu experiencia</p>
        </div>
      </div>

      {/* Contenido en dos columnas en PC */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6">

          {/* Columna izquierda */}
          <div className="flex-1 space-y-4">
            {/* Perfil */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md space-y-4">
              <h2 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <User className="w-5 h-5 text-violet-600" /> Perfil
              </h2>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Nombre</Label>
                {isEditingName ? (
                  <div className="flex gap-2">
                    <Input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="h-10 rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    />
                    <Button onClick={handleSaveName} className="bg-gradient-to-r from-violet-600 to-orange-500 rounded-xl">
                      Guardar
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span className="font-medium text-gray-900 dark:text-gray-100">{userName}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Apariencia */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md space-y-4">
              <h2 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Moon className="w-5 h-5 text-violet-600" /> Apariencia
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Modo oscuro</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tema oscuro para la aplicación</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </div>

            {/* Notificaciones */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md">
              <button onClick={() => navigate("/notifications")} className="w-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-violet-600" />
                  <div className="text-left">
                    <p className="font-bold text-gray-900 dark:text-gray-100">Notificaciones</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Gestiona tus recordatorios</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </button>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="flex-1 space-y-4">
            {/* Idioma */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md space-y-4">
              <h2 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Globe className="w-5 h-5 text-violet-600" /> Idioma
              </h2>
              <div className="space-y-2">
                {[
                  { code: "es", name: "Español" },
                  { code: "en", name: "English" },
                  { code: "pt", name: "Português" }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      language === lang.code
                        ? "bg-violet-50 dark:bg-violet-950 border-violet-400"
                        : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${language === lang.code ? "text-violet-700 dark:text-violet-300" : "text-gray-700 dark:text-gray-300"}`}>
                        {lang.name}
                      </span>
                      {language === lang.code && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-orange-500 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cerrar sesión */}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full h-14 border-2 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 font-bold rounded-2xl"
            >
              <LogOut className="w-5 h-5 mr-2" /> Cerrar sesión
            </Button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}