import React from 'react';
import { ShieldCheck, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
                SAI
              </div>
              <span className="font-bold text-white text-base uppercase tracking-tight">Solución Agropecuaria Integral</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Asesoría técnica agrícola y pecuaria especializada en el territorio ecuatoriano. Diagnóstico de cultivos, sanidad animal y distribución de insumos a finca.
            </p>
          </div>

          {/* Regional Coverage */}
          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-widest flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" /> Cobertura en Ecuador
            </h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Costa: Guayas, Manabí, Los Ríos, El Oro, Santo Domingo, Esmeraldas, Santa Elena</li>
              <li>• Sierra: Pichincha, Cotopaxi, Tungurahua, Chimborazo, Azuay, Loja, Imbabura, Carchi</li>
              <li>• Oriente & Insular: Sucumbíos, Orellana, Napo, Pastaza, Morona Santiago, Galápagos</li>
            </ul>
          </div>

          {/* Regulations & Security */}
          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Sanidad & Normativa
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Todos los insumos recomendados cuentan con Registro Oficial de AGROCALIDAD. Respete los tiempos de carencia y resguardo en leche y carne para garantizar la inocuidad alimentaria.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[10px] uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Solución Agropecuaria Integral S.A. Ecuador</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistema de Gestión Técnico Activo
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
