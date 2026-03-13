import { NavLink, useLocation, Outlet } from 'react-router-dom'
import { Home, PawPrint, AlertCircle, Heart, User } from 'lucide-react'

const navItems = [
  { to: '/',          icon: Home,        label: 'Home'    },
  { to: '/pets',      icon: PawPrint,    label: 'My Pets' },
  { to: '/emergency', icon: AlertCircle, label: 'SOS', sos: true },
  { to: '/adoption',  icon: Heart,       label: 'Adopt'   },
  { to: '/profile',   icon: User,        label: 'Profile' },
]

const hideNavRoutes = ['/login', '/register']

export default function AppShell() {
  const { pathname } = useLocation()
  const hideNav = hideNavRoutes.includes(pathname)

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white relative">

      {/* Page content */}
      <main className={`flex-1 overflow-y-auto ${hideNav ? '' : 'pb-20'}`}>
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      {!hideNav && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 flex justify-around items-center px-2 py-2 z-50 shadow-lg">
          {navItems.map(({ to, icon: Icon, label, sos }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all
                ${sos ? '' : isActive ? 'text-sage-dark' : 'text-gray-400'}`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex items-center justify-center rounded-full transition-all
                    ${
                      sos
                        ? 'w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 text-white shadow-lg -mt-5'
                        : isActive
                        ? 'w-10 h-10 bg-sage-dark text-white rounded-xl'
                        : 'w-10 h-10'
                    }`}
                  >
                    <Icon size={sos ? 22 : 20} />
                  </span>

                  <span
                    className={`text-[10px] font-medium ${
                      sos ? 'text-red-500' : ''
                    }`}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  )
}