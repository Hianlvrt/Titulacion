import { Link } from "react-router-dom";
import LogoNavBar from "/src/assets/LogoNavBar.png";

export function Navbar() {
  return (
    <header className="bg-white shadow-md border-b px-10 py-5 flex items-center justify-between">
      {/* Logo y Marca */}
      <Link
        to="/"
        className="flex items-center gap-4"
        aria-label="Sistema de predicción"
      >
        <img
          src={LogoNavBar}
          alt="Logo"
          className="h-20 w-auto max-w-[180px] object-contain"
        />
      </Link>

      {/* Navegación */}
      <nav className="flex gap-10 text-base font-medium text-gray-600">
        <Link
          to="/"
          className="hover:text-blue-600 transition-colors duration-200"
        >
          Inicio
        </Link>
        <a
          href="#datos-historicos"
          className="hover:text-blue-600 transition-colors duration-200"
        >
          Datos históricos
        </a>
        <a
          href="#grafico-prediccion"
          className="hover:text-blue-600 transition-colors duration-200"
        >
          Gráfico histórico
        </a>
        <a
          href="#prediccion"
          className="hover:text-blue-600 transition-colors duration-200"
        >
          Sistema de predicción
        </a>
      </nav>
    </header>
  );
}
