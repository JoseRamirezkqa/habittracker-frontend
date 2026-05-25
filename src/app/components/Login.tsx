import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Sparkles } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";

const API_URL = import.meta.env.VITE_API_URL;

export function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then((r) => r.json());

        const res = await fetch(`${API_URL}/usuarios/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userInfo.email,
            nombre: userInfo.name,
            fotoUrl: userInfo.picture,
          }),
        });

        if (res.ok) {
          const usuario = await res.json();
          localStorage.setItem("usuario", JSON.stringify(usuario));
          navigate("/dashboard");
        } else {
          setError("Error al iniciar sesión con Google");
        }
      } catch {
        setError("Error de conexión con Google");
      }
    },
    onError: () => setError("Error al iniciar sesión con Google"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    if (!isLogin && password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setCargando(false);
      return;
    }
    try {
      if (isLogin) {
        const res = await fetch(`${API_URL}/usuarios/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) { setError("Email o contraseña incorrectos"); return; }
        const usuario = await res.json();
        localStorage.setItem("usuario", JSON.stringify(usuario));
        navigate("/dashboard");
      } else {
        const res = await fetch(`${API_URL}/usuarios/registrar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, email, password }),
        });
        if (!res.ok) { setError("Error al registrarse, el email ya existe"); return; }
        const usuario = await res.json();
        localStorage.setItem("usuario", JSON.stringify(usuario));
        navigate("/dashboard");
      }
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-500 to-orange-500 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-center">

        {/* Panel izquierdo — solo visible en PC */}
        <div className="hidden md:flex flex-col justify-center flex-1 text-white px-8">
          <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4">HabitTracker</h1>
          <p className="text-xl text-white/80 leading-relaxed">
            Construye hábitos.<br />Cambia tu vida.
          </p>
          <div className="mt-10 space-y-4 text-white/70">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</div>
              <span>Registra tus hábitos diarios</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</div>
              <span>Visualiza tu progreso con estadísticas</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</div>
              <span>Recibe recordatorios personalizados</span>
            </div>
          </div>
        </div>

        {/* Panel derecho — formulario */}
        <div className="w-full md:max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 space-y-6">

          {/* Logo solo en celular */}
          <div className="flex flex-col items-center md:hidden space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-orange-500 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-orange-600 bg-clip-text text-transparent">
              HabitTracker
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-center">Construye hábitos. Cambia tu vida.</p>
          </div>

          {/* Título del formulario */}
          <div className="hidden md:block">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {isLogin ? "Bienvenido de vuelta" : "Crear cuenta"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {isLogin ? "Inicia sesión para continuar" : "Regístrate gratis"}
            </p>
          </div>

          {/* Botón Google */}
          <Button
            onClick={() => handleGoogleLogin()}
            className="w-full h-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl shadow-sm"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">o continúa con</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Nombre</Label>
                <Input
                  type="text"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="h-12 rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Correo electrónico</Label>
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Contraseña</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                required
              />
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Confirmar contraseña</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  required
                />
              </div>
            )}

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button
              type="submit"
              disabled={cargando}
              className="w-full h-12 bg-gradient-to-r from-violet-600 to-orange-500 text-white font-semibold rounded-2xl shadow-lg"
            >
              {cargando ? "Cargando..." : isLogin ? "Iniciar sesión" : "Registrarse"}
            </Button>
          </form>

          <div className="text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="text-violet-600 hover:text-violet-700 dark:text-violet-400 font-medium text-sm"
            >
              {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}