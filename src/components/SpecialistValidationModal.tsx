import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, KeyRound, UserPlus, AlertCircle, CheckCircle2, X, Award, Briefcase } from 'lucide-react';
import { AuthorizedSpecialist } from '../types';
import {
  getAuthorizedSpecialists,
  getActiveSpecialist,
  setActiveSpecialistByCedula,
  addNewSpecialist,
} from '../data/specialistAndHistoryStore';

interface SpecialistValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpecialistChanged?: (specialist: AuthorizedSpecialist) => void;
}

export const SpecialistValidationModal: React.FC<SpecialistValidationModalProps> = ({
  isOpen,
  onClose,
  onSpecialistChanged,
}) => {
  const [specialists, setSpecialists] = useState<AuthorizedSpecialist[]>([]);
  const [activeSpecialist, setActiveSpecialistState] = useState<AuthorizedSpecialist | null>(null);
  const [inputCedula, setInputCedula] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New specialist form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNombre, setNewNombre] = useState('');
  const [newCedula, setNewCedula] = useState('');
  const [newTitulo, setNewTitulo] = useState('Especialista Técnico Agropecuario');
  const [newExpYears, setNewExpYears] = useState(10);
  const [newSector, setNewSector] = useState<'agricola' | 'pecuario' | 'mixto'>('mixto');

  const reloadData = () => {
    const list = getAuthorizedSpecialists();
    setSpecialists(list);
    const active = getActiveSpecialist();
    setActiveSpecialistState(active);
  };

  useEffect(() => {
    if (isOpen) {
      reloadData();
      setFeedback(null);
      setInputCedula('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleValidateCedula = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const result = setActiveSpecialistByCedula(inputCedula);
    if (result.success && result.specialist) {
      setFeedback({ type: 'success', text: result.message });
      setActiveSpecialistState(result.specialist);
      reloadData();
      if (onSpecialistChanged) onSpecialistChanged(result.specialist);
    } else {
      setFeedback({ type: 'error', text: result.message });
    }
  };

  const handleRegisterNew = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const result = addNewSpecialist({
      cedula: newCedula,
      nombreCompleto: newNombre,
      tituloEspecialidad: newTitulo,
      experienciaAnos: Number(newExpYears),
      sectorFocus: newSector,
    });

    if (result.success && result.specialist) {
      setFeedback({ type: 'success', text: result.message });
      setShowAddForm(false);
      setNewNombre('');
      setNewCedula('');
      reloadData();
      if (onSpecialistChanged) onSpecialistChanged(result.specialist);
    } else {
      setFeedback({ type: 'error', text: result.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-emerald-900 text-white p-5 flex items-center justify-between border-b-4 border-emerald-600">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-800 rounded-xl border border-emerald-600">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg uppercase tracking-wider text-emerald-100">
                Especialistas de Turno
              </h3>
              <p className="text-xs text-emerald-300">
                Sistema de acceso y validación mediante número de Cédula de Identidad
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-2 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Active Specialist Card */}
          {activeSpecialist && (
            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-700 text-white rounded-full flex items-center justify-center font-black text-lg border-2 border-emerald-400 shadow shrink-0">
                  {activeSpecialist.nombreCompleto
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-800 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-300" /> Validado en Turno
                    </span>
                    <span className="text-xs text-emerald-700 font-bold">Acreditación Verificada</span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base mt-0.5">
                    {activeSpecialist.nombreCompleto}
                  </h4>
                  <p className="text-xs text-emerald-800 font-medium">
                    {activeSpecialist.tituloEspecialidad} • {activeSpecialist.experienciaAnos} años de experiencia
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Message */}
          {feedback && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-2 text-xs font-semibold ${
                feedback.type === 'success'
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                  : 'bg-red-50 border-red-300 text-red-800'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Validation Form */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-emerald-700" />
              Validar Cédula para Iniciar / Asumir Turno
            </h4>
            <form onSubmit={handleValidateCedula} className="flex gap-2">
              <input
                type="text"
                value={inputCedula}
                onChange={(e) => setInputCedula(e.target.value)}
                placeholder="Ingrese número de cédula (Ej. 1002631131)"
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-emerald-600 font-mono"
              />
              <button
                type="submit"
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl transition-all shadow flex items-center gap-1.5 shrink-0"
              >
                <UserCheck className="w-4 h-4" />
                Validar Cédula
              </button>
            </form>
            <p className="text-[11px] text-slate-500">
              * Ingrese el número de Cédula de Identidad del profesional acreditado para activar su turno.
            </p>
          </div>

          {/* Registered Specialists List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-700" />
                Nómina de Especialistas Habilitados
              </h4>
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-lg transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                {showAddForm ? 'Cancelar' : 'Registrar Nuevo Especialista'}
              </button>
            </div>

            {/* Form to add new specialist */}
            {showAddForm && (
              <form onSubmit={handleRegisterNew} className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 mb-4 space-y-3">
                <h5 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider">
                  Nuevo Registro de Profesional Habilitado
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Nombre Completo:</label>
                    <input
                      type="text"
                      required
                      value={newNombre}
                      onChange={(e) => setNewNombre(e.target.value)}
                      placeholder="Ej. Ing. Maria Salazar"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Número de Cédula:</label>
                    <input
                      type="text"
                      required
                      value={newCedula}
                      onChange={(e) => setNewCedula(e.target.value)}
                      placeholder="Ej. 1718293849"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Título / Especialidad:</label>
                    <input
                      type="text"
                      required
                      value={newTitulo}
                      onChange={(e) => setNewTitulo(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Años de Experiencia:</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      required
                      value={newExpYears}
                      onChange={(e) => setNewExpYears(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Área de Enfoque Principal:</label>
                    <select
                      value={newSector}
                      onChange={(e: any) => setNewSector(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-emerald-600 font-semibold"
                    >
                      <option value="agricola">Agrícola (Cultivos & Nutrición Vegetal)</option>
                      <option value="pecuario">Pecuaria (Ganadería & Salud Animal)</option>
                      <option value="mixto">Mixta (Agropecuaria Integral)</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase py-2 rounded-xl transition-colors shadow"
                >
                  Guardar e Ingresar Especialista
                </button>
              </form>
            )}

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {specialists.map((spec) => (
                <div
                  key={spec.id}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    spec.activoEnTurno
                      ? 'bg-emerald-100/60 border-emerald-400 font-bold text-emerald-950'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Award className={`w-4 h-4 ${spec.activoEnTurno ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <div>
                      <p className="font-extrabold text-slate-900">{spec.nombreCompleto}</p>
                      <p className="text-[11px] text-slate-500 font-normal">
                        {spec.tituloEspecialidad} ({spec.experienciaAnos} años de experiencia)
                      </p>
                    </div>
                  </div>
                  {spec.activoEnTurno ? (
                    <span className="bg-emerald-700 text-white font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-md">
                      En Turno
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveSpecialistByCedula(spec.cedula);
                        reloadData();
                      }}
                      className="text-[10px] font-bold text-slate-600 hover:text-emerald-800 bg-slate-100 hover:bg-emerald-100 px-2 py-1 rounded transition-colors"
                    >
                      Activar Turno
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
