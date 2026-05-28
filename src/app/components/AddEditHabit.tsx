import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  ArrowLeft, Dumbbell, Book, Heart, Briefcase,
  Droplet, Moon, Sunrise, Coffee, Apple, Brain,
  Music, Palette, Save, Trash2, Clock,
} from "lucide-react";
import { Switch } from "./ui/switch";

const API_URL = import.meta.env.VITE_API_URL;

const categoryOptions = [
  { name: "Ejercicio", value: "ejercicio", color: "from-orange-400 to-orange-600", defaultIcon: "dumbbell" },
  { name: "Productividad", value: "productividad", color: "from-blue-400 to-blue-600", defaultIcon: "briefcase" },
  { name: "Bienestar", value: "bienestar", color: "from-purple-400 to-violet-500", defaultIcon: "heart" },
  { name: "Mindfulness", value: "mindfulness", color: "from-pink-400 to-pink-600", defaultIcon: "moon" },
  { name: "Salud", value: "salud", color: "from-green-400 to-emerald-500", defaultIcon: "droplet" },
];

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
  const [mostrarIconos, setMostrarIconos] = useState(false);

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

  const seleccionarCategoria = (category: typeof categoryOptions[0]) => {
    setSelectedCategory(category.value);
    setSelectedIcon(category.defaultIcon);
    setMostrarIconos(false);
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
        await fetch(`${API_URL}/habitos/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(habito),
        });
      } else {
        await fetch(`${API_URL}/habitos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(habito),
        });
      }
      navigate("/habits");
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

  const selectedCategoryData = categoryOptions.find(c => c.value === selectedCategory);
  const selectedIconData = iconOptions.find(i => i.name === selectedIcon);
  const SelectedIconComponent = selectedIconData?.icon || Dumbbell;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-8">

      {/* Header con preview */}
      <div className="bg-gradient-to-r from-violet-600 to-orange-500 shadow-xl p-6 pb-8">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white mb-4 hover:opacity-80">
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedCategoryData?.color || "from-orange-400 to-orange-600"} flex items-center justify-center shadow-lg`}>
              <SelectedIconComponent className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">
                {isEdit ? "Editar hábito" : "Nuevo hábito"}
              </h1>
              <p className="text-white/80 text-sm mt-1">
                {habitName || "Escribe el nombre de tu hábito"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-5">

        {/* Paso 1 — Nombre */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">1</div>
            <Label className="text-gray-900 dark:text-gray-100 font-bold text-base">Nombre del hábito</Label>
          </div>
          <Input
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            placeholder="Ej: Correr 30 minutos, Leer antes de dormir..."
            className="h-12 rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 text-base"
          />
        </div>

        {/* Paso 2 — Categoría */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">2</div>
            <Label className="text-gray-900 dark:text-gray-100 font-bold text-base">Categoría</Label>
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">— elige una y el ícono se asigna automáticamente</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categoryOptions.map((category) => {
              const isSelected = selectedCategory === category.value;
              const defaultIconData = iconOptions.find(i => i.name === category.defaultIcon);
              const DefaultIcon = defaultIconData?.icon || Dumbbell;
              return (
                <button
                  key={category.value}
                  onClick={() => seleccionarCategoria(category)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? "border-violet-400 bg-violet-50 dark:bg-violet-950 shadow-md"
                      : "border-transparent bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0`}>
                    <DefaultIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`font-semibold text-sm ${isSelected ? "text-violet-700 dark:text-violet-300" : "text-gray-700 dark:text-gray-300"}`}>
                    {category.name}
                  </span>
                  {isSelected && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Personalizar ícono — opcional */}
          <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
            <button
              onClick={() => setMostrarIconos(!mostrarIconos)}
              className="text-sm text-violet-600 dark:text-violet-400 font-medium hover:underline"
            >
              {mostrarIconos ? "▲ Ocultar" : "▼ Personalizar ícono (opcional)"}
            </button>
            {mostrarIconos && (
              <div className="grid grid-cols-6 gap-2 mt-3">
                {iconOptions.map((iconOption) => {
                  const Icon = iconOption.icon;
                  const isSelected = selectedIcon === iconOption.name;
                  return (
                    <button
                      key={iconOption.name}
                      onClick={() => setSelectedIcon(iconOption.name)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                        isSelected
                          ? "bg-gradient-to-br from-violet-500 to-orange-500 text-white shadow-md"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{iconOption.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Paso 3 — Frecuencia y Recordatorio */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">3</div>
            <Label className="text-gray-900 dark:text-gray-100 font-bold text-base">Frecuencia y recordatorio</Label>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">¿Con qué frecuencia?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setFrequencyType("daily")}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  frequencyType === "daily"
                    ? "bg-gradient-to-r from-violet-600 to-orange-500 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                }`}
              >
                📅 Diario
              </button>
              <button
                onClick={() => setFrequencyType("specific")}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  frequencyType === "specific"
                    ? "bg-gradient-to-r from-violet-600 to-orange-500 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                }`}
              >
                📆 Días específicos
              </button>
            </div>
            {frequencyType === "specific" && (
              <div className="flex gap-2 mt-3 justify-between">
                {weekDays.map((day) => (
                  <button
                    key={day.value}
                    onClick={() => toggleDay(day.value)}
                    className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all ${
                      selectedDays.includes(day.value)
                        ? "bg-gradient-to-br from-violet-500 to-orange-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {day.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-violet-600" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Recordatorio</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Notificación diaria a esta hora</p>
                </div>
              </div>
              <Switch checked={reminderEnabled} onCheckedChange={setReminderEnabled} />
            </div>
            {reminderEnabled && (
              <Input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="h-12 rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 mt-3"
              />
            )}
          </div>
        </div>

        {/* Botones */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div className="space-y-3">
          <Button
            onClick={handleSave}
            disabled={cargando}
            className="w-full h-14 bg-gradient-to-r from-violet-600 to-orange-500 text-white font-bold rounded-2xl shadow-lg text-base"
          >
            <Save className="w-5 h-5 mr-2" />
            {cargando ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear hábito"}
          </Button>
          {isEdit && (
            <Button
              onClick={handleDelete}
              variant="outline"
              className="w-full h-12 border-2 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 font-bold rounded-2xl"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Eliminar hábito
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}