import { useState } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "./BottomNav";
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, Mail, Star } from "lucide-react";
import { Button } from "./ui/button";

const faqs = [
  {
    pregunta: "¿Cómo creo un nuevo hábito?",
    respuesta: "Ve a la pestaña Hábitos o al Dashboard, toca el botón + y completa el formulario con el nombre, ícono, categoría y frecuencia de tu hábito.",
  },
  {
    pregunta: "¿Cómo funciona la racha?",
    respuesta: "La racha cuenta los días consecutivos que completas un hábito. Si un día no lo marcas como completado, la racha se reinicia a cero. ¡Intenta mantenerla activa!",
  },
  {
    pregunta: "¿Puedo editar o eliminar un hábito?",
    respuesta: "Sí. Entra al detalle del hábito tocando sobre él y usa el ícono de lápiz en la esquina superior derecha para editarlo o eliminarlo.",
  },
  {
    pregunta: "¿Cómo activo los recordatorios?",
    respuesta: "Ve a Perfil → Notificaciones. Ahí puedes activar notificaciones globalmente y configurar la hora de recordatorio para cada hábito individualmente.",
  },
  {
    pregunta: "¿Mis datos están seguros?",
    respuesta: "Tus datos se guardan en una base de datos segura. Solo tú puedes acceder a ellos con tu cuenta. No compartimos tu información con terceros.",
  },
];

export function Help() {
  const navigate = useNavigate();
  const [expandido, setExpandido] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setExpandido(expandido === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-24">

      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-orange-500 rounded-b-3xl shadow-xl p-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white mb-6 hover:opacity-80">
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">Ayuda y soporte</h1>
              <p className="text-white/80 text-sm mt-1">¿En qué podemos ayudarte?</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido en dos columnas en PC */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6">

          {/* Columna izquierda — FAQs */}
          <div className="flex-1 space-y-4">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg">Preguntas frecuentes</h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className="font-medium text-gray-900 dark:text-gray-100 pr-4">{faq.pregunta}</span>
                    {expandido === index
                      ? <ChevronUp className="w-5 h-5 text-violet-600 dark:text-violet-400 flex-shrink-0" />
                      : <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    }
                  </button>
                  {expandido === index && (
                    <div className="px-4 pb-4">
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{faq.respuesta}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Columna derecha — Contacto y acciones */}
          <div className="flex flex-col gap-4 md:w-72">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">¿Necesitas más ayuda?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Si no encontraste respuesta a tu pregunta, contáctanos directamente y te ayudaremos lo antes posible.
              </p>
              <Button
                onClick={() => window.open("mailto:soporte@habittracker.com")}
                variant="outline"
                className="w-full h-12 border-2 border-violet-300 dark:border-violet-700 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950 font-bold rounded-2xl"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contactar soporte
              </Button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">¿Te gusta la app?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tu opinión nos ayuda a mejorar. ¡Déjanos una valoración!
              </p>
              <Button
                className="w-full h-12 bg-gradient-to-r from-violet-600 to-orange-500 text-white font-bold rounded-2xl"
                onClick={() => alert("¡Gracias por tu valoración! 🌟")}
              >
                <Star className="w-5 h-5 mr-2" />
                Calificar la app
              </Button>
            </div>

            <div className="bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-950 dark:to-purple-950 rounded-2xl p-6 border border-violet-200 dark:border-violet-800">
              <p className="font-semibold text-violet-900 dark:text-violet-300 mb-2">💡 Consejo rápido</p>
              <p className="text-sm text-violet-800 dark:text-violet-400">
                Completa tus hábitos a la misma hora cada día para formar una rutina sólida más rápido.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
