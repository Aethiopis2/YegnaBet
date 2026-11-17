import {
  BriefcaseBusiness,
  Building2,
  LucideView,
  ClipboardList,
  FilePlus,
  Home,
  MessageSquare,
  Settings,
  Tags,
  UserPlus,
  Users,
} from "lucide-react";

import {
  NavLink,
  useLocation,
} from "react-router-dom";
import type { AuthUser } from "../../types/auth/authTypes";

const mainNavigation = [
  {
    label: "Dashboard",
    path: "/employee",
    icon: Home,
  },
  {
    label: "Requests",
    path: "/employee/requests",
    icon: ClipboardList,
  },
  {
    label: "New Listing",
    path: "/employee/create-listing",
    icon: FilePlus, 
  },
  {
    label: "View Listings",
    path: "/employee/listings",
    icon: LucideView,
  },
  {
    label: "Messages",
    path: "/employee/messages",
    icon: MessageSquare,
  },
  {
    label: "Deals",
    path: "/employee/deals",
    icon: BriefcaseBusiness,
  },
  // {
  //   label: "Reports",
  //   path: "/employee/reports",
  //   icon: FileBarChart,
  // },
];

const configurationNavigation = [
  {
    label: "Taxonomies",
    path: "/employee/taxonomies",
    icon: Tags,
  },
  {
    label: "Add Employee",
    path: "/employee/employees/new",
    icon: UserPlus,
  },
  {
    label: "Edit Employee",
    path: "/employee/employees",
    icon: Users,
  },
  {
    label: "Providers",
    path: "/employee/providers",
    icon: Building2,
  },
];

interface Props {
  user: AuthUser | null;
}

export function EmployeeSidebar({user}:Props) {
  return (
    <aside
      className="
        fixed
        inset-y-0
        left-0
        z-40
        hidden
        w-64
        flex-col
        border-r
        border-black/5
        bg-white
        lg:flex

        dark:border-white/6
        dark:bg-[#101512]
      "
    >
      {/* BRAND */}

      <div className="flex h-16 items-center px-5">
        <div>
          <div
            className="
              text-xl
              font-extrabold
              tracking-tight
              text-yegna-700
            "
          >
            Yegna<span className="text-gray-900 dark:text-white">Bet</span>
          </div>

          <p className="text-[8px] font-medium uppercase tracking-[0.16em] text-gray-400">
            Broker System
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <NavigationGroup
          items={mainNavigation}
        />

        <div className="my-5 h-px bg-black/5 dark:bg-white/6" />

        <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">
          Configuration
        </p>

        <NavigationGroup
          items={configurationNavigation}
        />

        <NavigationItem
          label="Settings"
          path="/employee/settings"
          icon={Settings}
        />
      </nav>

      {/* USER */}

      <div className="border-t border-black/5 p-3 dark:border-white/6">
        <button
          type="button"
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            p-2
            text-left
            transition
            hover:bg-gray-50
            dark:hover:bg-white/4
          "
        >
          <div
            className="
              grid
              size-9
              shrink-0
              place-items-center
              rounded-full
              bg-yegna-100
              text-xs
              font-bold
              text-yegna-700
            "
          >
            {user && user.fullName.trim()[0].toUpperCase() + user.fullName.trim()[1].toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-semibold">
              {user?.fullName}
            </p>

            <p className="truncate text-[9px] text-gray-400">
              {user?.role}
            </p>
          </div>
        </button>
      </div>
    </aside>
  );
}

function NavigationGroup({
  items,
}: {
  items: typeof mainNavigation;
}) {
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <NavigationItem
          key={item.path}
          {...item}
        />
      ))}
    </div>
  );
}

function NavigationItem({
  label,
  path,
  icon: Icon,
}: {
  label: string;
  path: string;
  icon: React.ElementType;
}) {
  const location = useLocation();
  const employeeEditRoute = path === "/employee/employees" &&
    /^\/employee\/employees\/\d+\/edit$/.test(location.pathname);

  return (
    <NavLink
      to={path}
      end={path === "/employee" || path === "/employee/employees"}
      className={({ isActive }) => `
        group
        flex
        items-center
        gap-3
        rounded-xl
        px-3
        py-2.5
        text-xs
        font-medium
        transition-all
        duration-200

          ${
          isActive || employeeEditRoute
            ? "bg-yegna-700 text-white shadow-sm shadow-yegna-700/20"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/4 dark:hover:text-white"
        }
      `}
    >
      <Icon className="size-4 shrink-0" />

      <span>{label}</span>
    </NavLink>
  );
}
