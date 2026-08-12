import { Outlet, NavLink } from 'react-router-dom';
import { House, Utensils, ChefHat, ChartNoAxesCombined, UserRound } from 'lucide-react';

export default function MainLayout() {
  const navItems = [
    { to: '/app', icon: House, label: 'Home' },
    { to: '/app/meals', icon: Utensils, label: 'Meals' },
    { to: '/app/prep', icon: ChefHat, label: 'Prep' },
    { to: '/app/progress', icon: ChartNoAxesCombined, label: 'Progress' },
    { to: '/app/profile', icon: UserRound, label: 'Profile' },
  ];

  return (
    <div className="relative min-h-screen bg-leanly-background dark:bg-gray-900 pb-32 transition-colors">
      <main className="h-full">
        <Outlet />
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 pointer-events-none flex justify-center pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <nav className="pointer-events-auto bg-[#1a1a1a] p-2 rounded-[2rem] shadow-nav flex items-center justify-between w-full max-w-md">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app'}
              className={({ isActive }) =>
                `flex items-center justify-center transition-all duration-300 ease-out overflow-hidden ${
                  isActive
                    ? 'bg-white text-[#151515] px-5 py-3 rounded-full'
                    : 'text-[#9A9F9A] hover:text-white p-3'
                }`
              }
            >
              {({ isActive }) => (
                <div className="flex items-center gap-2">
                  <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                  {isActive && (
                    <span className="text-sm font-semibold tracking-wide whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
