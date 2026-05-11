import { NavLink, Outlet } from "react-router-dom";
import { Building2 } from "lucide-react";
import { Footer } from "./Footer";

export function Layout() {
  const navCls = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
      isActive
        ? "bg-bank-100 text-bank-700"
        : "text-slate-600 hover:text-bank-800 hover:bg-slate-100"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50
          focus:rounded-md focus:bg-bank-700 focus:px-4 focus:py-2 focus:text-white
          focus:text-sm focus:font-medium focus:shadow-lg"
      >
        Ir al contenido principal
      </a>

      <header className="bg-white border-b border-slate-200 shadow-card sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logotipo */}
          <div className="flex items-center gap-2.5 mr-auto">
            <div
              className="w-9 h-9 rounded-lg bg-gradient-to-br from-bank-700 to-bank-900
                flex items-center justify-center shrink-0 shadow-sm"
              aria-hidden="true"
            >
              <Building2 size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="font-bold text-bank-900 text-[15px] tracking-tight">
                CreditScore AI
              </p>
              <p className="hidden sm:block text-[11px] text-slate-400 leading-none">
                Riesgo Crediticio · TFM
              </p>
            </div>
          </div>

          <nav aria-label="Navegación principal" className="flex items-center gap-1">
            <NavLink to="/" end className={navCls}>
              Evaluación manual
            </NavLink>
            <NavLink to="/batch" className={navCls}>
              Por lotes
            </NavLink>
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
