import { createBrowserRouter } from "react-router";
import { Onboarding } from "./components/Onboarding";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { HabitsList } from "./components/HabitsList";
import { HabitDetail } from "./components/HabitDetail";
import { AddEditHabit } from "./components/AddEditHabit";
import { Stats } from "./components/Stats";
import { Profile } from "./components/Profile";
import { Settings } from "./components/Settings";
import { Notifications } from "./components/Notifications";
import { Help } from "./components/Help";

export const router = createBrowserRouter([
  { path: "/", Component: Onboarding },
  { path: "/login", Component: Login },
  { path: "/dashboard", Component: Dashboard },
  { path: "/habits", Component: HabitsList },
  { path: "/habit/:id", Component: HabitDetail },
  { path: "/add-habit", Component: AddEditHabit },
  { path: "/edit-habit/:id", Component: AddEditHabit },
  { path: "/stats", Component: Stats },
  { path: "/profile", Component: Profile },
  { path: "/settings", Component: Settings },
  { path: "/notifications", Component: Notifications },
  { path: "/help", Component: Help },
]);