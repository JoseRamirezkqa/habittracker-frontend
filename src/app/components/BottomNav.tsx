import { Home, Target, BarChart3, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Inicio", path: "/dashboard" },
    { icon: Target, label: "Hábitos", path: "/habits" },
    { icon: BarChart3, label: "Estadísticas", path: "/stats" },
    { icon: User, label: "Perfil", path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="max-w-[375px] mx-auto flex justify-around items-center h-20 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center gap-1 transition-all"
            >
              <div
                className={`p-2 rounded-xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-violet-500 to-orange-500"
                    : "bg-transparent"
                }`}
              >
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    isActive ? "text-white" : "text-gray-400"
                  }`}
                />
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive ? "text-violet-600" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}