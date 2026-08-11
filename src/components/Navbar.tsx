import React from 'react';
import { Bot, FileText, ShoppingBag, Calculator, ShieldCheck, MapPin, Lock, UserCheck, History } from 'lucide-react';
import { AuthorizedSpecialist } from '../types';

interface NavbarProps {
  activeTab: 'chat' | 'diagnostic' | 'catalog' | 'calculator' | 'history';
  setActiveTab: (tab: 'chat' | 'diagnostic' | 'catalog' | 'calculator' | 'history') => void;
  onOpenAdminModal?: () => void;
  onOpenSpecialistModal?: () => void;
  activeSpecialist?: AuthorizedSpecialist;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAdminModal,
  onOpenSpecialistModal,
  activeSpecialist,
}) => {
  const specialistName = activeSpecialist?.nombreCompleto || 'Ing. Carlos Polanco Jácome';
  const specialistCedula = activeSpecialist?.cedula || '1002631131';
  const initials = specialistName
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .join('')
    .substring(0, 2);

  return (
    <header className="bg-emerald-900 border-b-4 border-emerald-600 text-white sticky top-0 z-40 shadow-lg">
      {/* Top emergency & banner */}
      <div className="bg-emerald-950 text-emerald-200 text-xs py-1.5 px-4 border-b border-emerald-900/80">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-semibold text-[11px] uppercase tracking-wider text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Asesoría Técnica Certificada Agropecuaria • AGROCALIDAD Ecuador
            </span>
            <span className="hidden md:inline text-emerald-700">•</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300 text-[11px]">
              <MapPin className="w-3 h-3 text-amber-400" />
              Atención Técnica Especializada (24 Provincias)
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-emerald-200 text-[11px] font-medium">
              Especialistas con 10 Años de Experiencia
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div
          onClick={() => setActiveTab('chat')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C10 14.5 10 11 10 11"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight uppercase text-white group-hover:text-emerald-200 transition-colors">
                Solución Agropecuaria Integral
              </h1>
              <span className="bg-emerald-800 text-emerald-200 border border-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Ecuador
              </span>
            </div>
            <p className="text-xs text-emerald-200 uppercase tracking-widest font-semibold hidden sm:block">
              Asesoría Técnica Agrícola & Pecuaria • Gestión Profesional
            </p>
          </div>
        </div>

        {/* Right Specialist Duty & Admin buttons */}
        <div className="flex items-center gap-3 sm:gap-4">
          {onOpenAdminModal && (
            <button
              onClick={onOpenAdminModal}
              className="bg-emerald-950 hover:bg-black text-emerald-300 hover:text-white px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow border border-emerald-700/60"
              title="Panel para agregar o editar productos en el catálogo"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline uppercase tracking-wider text-[11px]">Gestión Catálogo</span>
            </button>
          )}

          {/* Validated Specialist on Duty Button */}
          {onOpenSpecialistModal && (
            <button
              onClick={onOpenSpecialistModal}
              className="bg-emerald-800 hover:bg-emerald-700 text-white px-3 sm:px-4 py-2 rounded-xl border border-emerald-500/60 flex items-center gap-2.5 transition-all shadow-md text-left"
              title="Haz clic para validar cédula o cambiar especialista de turno"
            >
              <div className="h-8 w-8 rounded-full bg-emerald-600 border border-emerald-300 flex items-center justify-center text-xs font-black text-white shadow-inner shrink-0">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[9px] text-amber-300 uppercase tracking-widest font-extrabold flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-amber-300" /> Especialista en Turno
                </p>
                <p className="text-xs font-extrabold text-white line-clamp-1">
                  {specialistName}
                </p>
                <p className="text-[10px] text-emerald-200 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3 h-3 text-emerald-300" /> Especialista Habilitado
                </p>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Bar Tabs */}
      <div className="border-t border-emerald-950 bg-slate-900/90 backdrop-blur px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-1.5 scrollbar-none">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-emerald-600 text-white shadow-md border border-emerald-400/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bot className="w-4 h-4 text-emerald-300" />
            Asesoría Virtual
          </button>

          <button
            onClick={() => setActiveTab('diagnostic')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'diagnostic'
                ? 'bg-emerald-600 text-white shadow-md border border-emerald-400/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-300" />
            Plan Técnico Guiado
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'bg-emerald-600 text-white shadow-md border border-emerald-400/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-300" />
            Catálogo Ecuador
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'calculator'
                ? 'bg-emerald-600 text-white shadow-md border border-emerald-400/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4 text-blue-300" />
            Calculadora Dosis & Resguardo
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-emerald-600 text-white shadow-md border border-emerald-400/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4 text-amber-300" />
            Historial de Chats Diarios
          </button>
        </div>
      </div>
    </header>
  );
};
