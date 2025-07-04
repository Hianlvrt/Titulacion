// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t mt-20 py-8 text-center text-sm text-muted-foreground">
      <p>© {new Date().getFullYear()} Sistema Predicción Acciones CENCOSUD — Desarrollado por Hian Lart</p>
      <p>
  ⚠️ Las predicciones presentadas tienen fines informativos. No constituyen asesoría financiera.
</p>

    </footer>
  );
}
