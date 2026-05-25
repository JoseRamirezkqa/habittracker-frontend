import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { BottomNav } from "./BottomNav";
import {
  ArrowLeft, Dumbbell, Book, Heart, Briefcase,
  Droplet, Moon, Sunrise, Coffee, Apple, Brain,
  Music, Palette, Save, Trash2, Clock,
} from "lucide-react";
import { Switch } from "./ui/switch";

const API_URL = import.meta.env.VITE_API_URL;

const iconOptions = [
  { icon: Dumbbell, name: "dumbbell", label: "Ejercicio" },
  { icon: Book, name: "book", label: "Lectura" },
  { icon: Heart, name: "heart", label: "Salud" },
  { icon: Briefcase, name: "briefcase", label: "Trabajo" },
  { icon: Droplet, name: "droplet", label: "Agua" },
  { icon: Moon, name: "moon", label: "Sueño" },
  { icon: Sunrise, name: "sunrise", label: "Mañana" },
  { icon: Coffee, name: "coffee", label: "Café" },
  { icon: Apple, name: "apple", label: "Comida" },
  { icon: Brain, name: "brain", label: "Mental" },
  { icon: Music, name: "music", label: "Música" },
  { icon: Palette, name: "palette", label: "Arte" },
];

const categoryOptions = [
  { name: "Ejercicio", value: "ejercicio", color: "from-orange-400 to-orange-600", bg: "bg-orange-100", border: "border-orange-400" },
  { name: "Productividad", value: "productividad", color: "from-blue-400 to-blue-600", bg: "bg-blue-100", border: "border-blue-400" },
  { name: "Bienestar", value: "bienestar", color: "from-purple-400 to-violet-500", bg: "bg-purple-100", border: "border-purple-400" },
  { name: "Mindfulness", value: "mindfulness", color: "from-pink-400 to-pink-600", bg: "bg-pink-100", border: "border-pink-400" },
  { name: "Salud", value: "salud", color: "from-green-400 to-emerald-500", bg: "bg-green-100", border: "border-green-400" },
];

const weekDays = [
  { name: "L", value: "monday" },
  { name: "M", value: "tuesday" },
  { name: "M", value: "wednesday" },
  { name: "J", value: "thursday" },
  { name: "V", value: "friday" },
  { name: "S", value: "saturday" },
  { name: "D", value: "sunday" },
];

export function AddEditHabit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [habitName, setHabitName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("dumbbell");
  const [selectedCategory, setSelectedCategory] = useState("ejercicio");
  const [frequencyType, setFrequencyType] = useState<"daily" | "specific">("daily");
  const [selectedDays, setSelectedDays] = useState<string[]>(["monday", "wednesday", "friday"]);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("08:00");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) cargarHabito();
  }, [id]);

  const cargarHabito = async () => {
    try {
      const res = await fetch(`${API_URL}/habitos/${id}`);
      const data = await res.json();
      setHabitName(data.nombre);
      setSelectedIcon(data.icono || "dumbbell");
      setSelectedCategory(data.categoria || "ejercicio");
      setFrequencyType(data.frecuencia === "DIARIO" ? "daily" : "specific");
      if (data.diasSemana) setSelectedDays(data.diasSemana.split(","));
      if (data.horaRecordatorio) {
        setReminderEnabled(true);
        setReminderTime(data.horaRecordatorio);
      }
    } catch (e) {
      console.error("Error cargando hábito", e);
    }
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    if (!habitName.trim()) { setError("El nombre del hábito es obligatorio"); return; }
    setCargando(true);
    setError("");
    try {
      const usuarioGuardado = localStorage.getItem("usuario");
      if (!usuarioGuardado) { navigate("/"); return; }
      const usuario = JSON.parse(usuarioGuardado);
      const habito = {
        nombre: habitName,
        icono: selectedIcon,
        categoria: selectedCategory,
        frecuencia: frequencyType === "daily" ? "DIARIO" : "SEMANAL",
        diasSemana: frequencyType === "specific" ? selectedDays.join(",") : null,
        horaRecordatorio: reminderEnabled ? reminderTime : null,
        usuario: { id: usuario.id },
      };
      if (isEdit) {
        await fetch(`${API_URL}/habitos/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(habito) });
      } else {
        await fetch(`${API_URL}/habitos`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(habito) });
      }
      navigate("/dashboard");
    } catch (e) {
      setError("Error al guardar el hábito");
    } finally {
      setCargando(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este hábito?")) {
      try {
        await fetch(`${API_URL}/habitos/${id}`, { method: "DELETE" });
        navigate("/habits");
      } catch (e) {
        setError("Error al eliminar el hábito");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-24">
      <div className="max-w-[375px] mx-auto pb-8">
        <div className="bg-gradient-to-r from-violet-600 to-orange-500 rounded-b-3xl shadow-xl p-6 pb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white mb-6 hover:opacity-80">
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <h1 className="text-white text-2xl font-bold">{isEdit ? "Editar hábito" : "Nuevo hábito"}</h1>
          <p className="text-white/80 text-sm mt-2">{isEdit ? "Modifica los detalles de tu hábito" : "Crea un nuevo hábito para seguir"}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Nombre */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md space-y-3">
            <Label className="text-gray-900 dark:text-gray-100 font-bold">Nombre del hábito</Label>
            <Input
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              placeholder="Ej: Hacer ejercicio"
              className="h-12 rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          {/* Ícono */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md space-y-3">
            <Label className="text-gray-900 dark:text-gray-100 font-bold">Ícono</Label>
            <div className="grid grid-cols-4 gap-3">
              {iconOptions.map((iconOption) => {
                const Icon = iconOption.icon;
                const isSelected = selectedIcon === iconOption.name;
                return (
                  <button
                    key={iconOption.name}
                    onClick={() => setSelectedIcon(iconOption.name)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                      isSelected
                        ? "bg-gradient-to-br from-violet-500 to-orange-500 text-white shadow-lg scale-105"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs font-medium">{iconOption.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categoría */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md space-y-3">
            <Label className="text-gray-900 dark:text-gray-100 font-bold">Categoría</Label>
            <div className="space-y-2">
              {categoryOptions.map((category) => {
                const isSelected = selectedCategory === category.value;
                return (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? `${category.bg} ${category.border} shadow-md`
                        : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color}`}></div>
                      <span className={`font-semibold ${isSelected ? "text-gray-900" : "text-gray-600 dark:text-gray-300"}`}>
                        {category.name}
                      </span>
                      {isSelected && (
                        <div className="ml-auto w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-orange-500 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Frecuencia */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md space-y-4">
            <Label className="text-gray-900 dark:text-gray-100 font-bold">Frecuencia</Label>
            <div className="flex gap-2">
              <button
                onClick={() => setFrequencyType("daily")}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  frequencyType === "daily"
                    ? "bg-gradient-to-r from-violet-600 to-orange-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >Diario</button>
              <button
                onClick={() => setFrequencyType("specific")}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  frequencyType === "specific"
                    ? "bg-gradient-to-r from-violet-600 to-orange-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >Días específicos</button>
            </div>
            {frequencyType === "specific" && (
              <div className="grid grid-cols-7 gap-2 pt-2">
                {weekDays.map((day) => (
                  <button
                    key={day.value}
                    onClick={() => toggleDay(day.value)}
                    className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                      selectedDays.includes(day.value)
                        ? "bg-gradient-to-br from-violet-500 to-orange-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    }`}
                  >{day.name}</button>
                ))}
              </div>
            )}
          </div>

          {/* Recordatorio */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-violet-600" />
                <Label className="text-gray-900 dark:text-gray-100 font-bold">Recordatorio</Label>
              </div>
              <Switch checked={reminderEnabled} onCheckedChange={setReminderEnabled} />
            </div>
            {reminderEnabled && (
              <Input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="h-12 rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            )}
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="space-y-3">
            <Button
              onClick={handleSave}
              disabled={cargando}
              className="w-full h-14 bg-gradient-to-r from-violet-600 to-orange-500 text-white font-bold rounded-2xl shadow-lg"
            >
              <Save className="w-5 h-5 mr-2" />
              {cargando ? "Guardando..." : "Guardar hábito"}
            </Button>
            {isEdit && (
              <Button
                onClick={handleDelete}
                variant="outline"
                className="w-full h-14 border-2 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 font-bold rounded-2xl"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Eliminar hábito
              </Button>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}