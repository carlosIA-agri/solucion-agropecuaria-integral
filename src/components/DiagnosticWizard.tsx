import React, { useState } from 'react';
import { ECUADOR_PROVINCES } from '../data/ecuadorLocations';
import { DiagnosticFormData, TechnicalWorkPlan } from '../types';
import { useProducts } from '../data/productStore';
import {
  FileCheck,
  Stethoscope,
  ClipboardList,
  Printer,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const DiagnosticWizard: React.FC = () => {
  const ecuadorProducts = useProducts();
  const [formData, setFormData] = useState<DiagnosticFormData>({
    sector: 'agricola',
    provincia: 'Pichincha',
    cantonSector: 'Mejía (Machachi)',
    especieOCultivo: 'Bovino Leche',
    variedadORaza: 'Holstein Friesian',
    numeroAnimalesOSuperficie: '20 cabezas (promedio 450 kg)',
    etapaDesarrollo: 'Lactancia pico',
    sintomasObservados: 'Inflamación de ubre, grumos en la leche, fiebre leve y reducción del apetito.',
    duracionProblema: '3 días',
    tratamientosPrevios: 'Ninguno',
  });

  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<TechnicalWorkPlan | null>(null);

  const selectedProvinceObj = ECUADOR_PROVINCES.find((p) => p.nombre === formData.provincia);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagnosticData: formData }),
      });

      if (!response.ok) {
        throw new Error('No se pudo generar el plan automático');
      }

      const data = await response.json();

      const newPlan: TechnicalWorkPlan = {
        id: 'PLAN-EC-' + Math.floor(1000 + Math.random() * 9000),
        fecha: new Date().toLocaleDateString('es-EC', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        provincia: formData.provincia,
        sector: formData.sector === 'agricola' ? 'Agrícola' : 'Pecuario',
        diagnosticoPresuntivo: data.diagnosticoPresuntivo || 'Afección que requiere intervención técnica inmediata.',
        causasProbables: data.causasProbables || ['Factores ambientales', 'Agentes patógenos locales'],
        planDeTratamiento: data.planDeTratamiento || [],
        medidasBioseguridadManejo: data.medidasBioseguridadManejo || [],
        costoEstimadoInsumosUSD: data.costoEstimadoInsumosUSD || 0,
        resumenGarantia: data.resumenGarantia || 'Atención personalizada por especialista de turno.',
      };

      setGeneratedPlan(newPlan);
    } catch (err) {
      console.error(err);
      alert('Ocurrió un inconveniente al generar el plan. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 rounded-2xl mb-8 border border-emerald-800/60 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Generador de Plan Técnico Guiado
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Obtenga un diagnóstico presuntivo y prescripción técnica completa con productos disponibles en Ecuador.
              </p>
            </div>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full border border-emerald-500/30 font-semibold">
            Protocolos AGROCALIDAD
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
          <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-emerald-600" /> Formulario Diagnóstico del Predio
          </h3>

          <form onSubmit={handleGeneratePlan} className="space-y-4 text-xs sm:text-sm">
            {/* Sector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sector Productivo *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, sector: 'agricola', especieOCultivo: 'Banano' })}
                  className={`p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                    formData.sector === 'agricola'
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🌾 Agrícola (Cultivos)
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, sector: 'veterinario', especieOCultivo: 'Bovino Leche' })}
                  className={`p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                    formData.sector === 'veterinario'
                      ? 'bg-amber-600 text-white border-amber-700 shadow'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🐄 Pecuario (Animales)
                </button>
              </div>
            </div>

            {/* Provincia & Canton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Provincia (Ecuador) *
                </label>
                <select
                  value={formData.provincia}
                  onChange={(e) => setFormData({ ...formData, provincia: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none focus:border-emerald-500 font-medium"
                >
                  {ECUADOR_PROVINCES.map((p) => (
                    <option key={p.nombre} value={p.nombre}>
                      {p.nombre} ({p.region})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cantón / Sector
                </label>
                <select
                  value={formData.cantonSector}
                  onChange={(e) => setFormData({ ...formData, cantonSector: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none focus:border-emerald-500 font-medium"
                >
                  {selectedProvinceObj?.cantonesPrincipales.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cultivo / Especie */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {formData.sector === 'agricola' ? 'Cultivo Principal *' : 'Especie Animal *'}
              </label>
              <select
                value={formData.especieOCultivo}
                onChange={(e) => setFormData({ ...formData, especieOCultivo: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none focus:border-emerald-500 font-medium"
              >
                {formData.sector === 'agricola' ? (
                  <>
                    <option value="Banano">Banano / Plátano</option>
                    <option value="Cacao">Cacao</option>
                    <option value="Papa">Papa / Tubérculos</option>
                    <option value="Maíz">Maíz (Duro / Amiláceo)</option>
                    <option value="Rosa">Rosa / Flores de Exportación</option>
                    <option value="Arroz">Arroz</option>
                    <option value="Café">Café</option>
                    <option value="Frutales">Frutales (Aguacate, Cítricos, Tomate Árbol)</option>
                    <option value="Hortalizas">Hortalizas y Verduras</option>
                  </>
                ) : (
                  <>
                    <option value="Bovino Leche">Bovino de Leche</option>
                    <option value="Bovino Carne">Bovino de Carne / Engorde</option>
                    <option value="Porcino">Porcino (Cerdos)</option>
                    <option value="Avícola">Avícola (Pollos / Gallinas)</option>
                    <option value="Ovino / Caprino">Ovino / Caprino (Ovejas / Cabras)</option>
                    <option value="Equino">Equino (Caballos / Mulas)</option>
                  </>
                )}
              </select>
            </div>

            {/* Extensión / Animales */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {formData.sector === 'agricola' ? 'Superficie / Hectáreas' : 'Número de Animales / Peso Promedio'}
              </label>
              <input
                type="text"
                value={formData.numeroAnimalesOSuperficie}
                onChange={(e) => setFormData({ ...formData, numeroAnimalesOSuperficie: e.target.value })}
                placeholder="ej. 3 Hectáreas o 25 cabezas (peso 400kg)"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Síntomas */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Síntomas y Problema Observado *
                </label>
                {formData.sintomasObservados.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, sintomasObservados: '' })}
                    className="text-[11px] font-bold text-red-600 hover:text-red-800 hover:underline flex items-center gap-0.5"
                  >
                    Borrar / Limpiar texto
                  </button>
                )}
              </div>
              <textarea
                rows={3}
                value={formData.sintomasObservados}
                onChange={(e) => setFormData({ ...formData, sintomasObservados: e.target.value })}
                placeholder="Describa libremente manchas, fiebre, tos, falta de crecimiento, heridas, leches con grumos, malezas..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none focus:border-emerald-500 text-xs font-medium text-slate-900 leading-relaxed"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generando Plan Técnico Ecuador...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generar Plan de Trabajo Técnico</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7">
          {generatedPlan ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg space-y-6">
              {/* Plan Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase">
                    Plan Técnico Oficial • {generatedPlan.id}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    Plan de Tratamiento para {formData.especieOCultivo} en {generatedPlan.provincia}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fecha de emisión: {generatedPlan.fecha}
                  </p>
                </div>

                <button
                  onClick={() => window.print()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" /> Imprimir Plan
                </button>
              </div>

              {/* Diagnóstico Presuntivo */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 text-xs sm:text-sm">
                <h4 className="font-bold text-emerald-900 mb-1 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-700" /> Diagnóstico Presuntivo:
                </h4>
                <p className="text-emerald-950 font-medium leading-relaxed">
                  {generatedPlan.diagnosticoPresuntivo}
                </p>
              </div>

              {/* Tratamiento Prescrito */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Prescripción de Insumos Registrados en Ecuador:
                </h4>

                <div className="space-y-5">
                  {generatedPlan.planDeTratamiento.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white border-2 border-emerald-600/30 rounded-2xl p-4.5 space-y-3 shadow-sm hover:shadow-md transition-all"
                    >
                      {/* Header Opción 1 */}
                      <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <span className="bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                            Tratamiento Recomendado
                          </span>
                          <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded">
                            Sugerido: {item.cantidadSugerida}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-baseline justify-between gap-2 mt-1">
                          <div>
                            <h5 className="text-emerald-950 font-black text-base">
                              {item.nombreComercial}
                            </h5>
                            <p className="text-xs text-slate-600 font-medium">
                              Ingrediente Activo: {item.ingredienteActivo}
                            </p>
                          </div>
                          <span className="text-emerald-800 font-extrabold text-sm">
                            Ref. ${item.precioEstimadoUSD ? item.precioEstimadoUSD.toFixed(2) : '18.50'} USD
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-2 border-t border-emerald-200/80 mt-2">
                          <div>
                            <span className="font-bold text-slate-900">Dosis Recomendada:</span>{' '}
                            {item.dosisExacta}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900">Forma de Aplicación:</span>{' '}
                            {item.formaAplicacion}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900">Frecuencia / Repetición:</span>{' '}
                            {item.frecuenciaYRepeticion}
                          </div>
                          <div className="text-red-700 font-bold bg-red-100/80 px-2 py-1 rounded border border-red-200">
                            Resguardo/Carencia: {item.periodoResguardo}
                          </div>
                        </div>
                      </div>

                      {/* Opción 2 / Alternativa del Mercado */}
                      {item.opcion2Alternativa && (
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                              Opción Alternativa de Mercado Ecuador
                            </span>
                            <span className="text-[11px] text-slate-500 italic">Producto Comercial</span>
                          </div>
                          <p className="font-bold text-slate-800 pt-1">
                            {item.opcion2Alternativa.nombreComercial}{' '}
                            <span className="font-normal text-slate-500">({item.opcion2Alternativa.ingredienteActivo})</span>
                          </p>
                          <p className="text-slate-600">
                            <strong className="text-slate-700">Dosis Alternativa:</strong> {item.opcion2Alternativa.dosisExacta}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Medidas de Manejo */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">
                  Recomendaciones Adicionales de Manejo & Bioseguridad:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {generatedPlan.medidasBioseguridadManejo.map((medida, mIdx) => (
                    <li key={mIdx}>{medida}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <FileCheck className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-800">
                Aún no ha generado su Plan Técnico
              </h4>
              <p className="text-xs max-w-md mx-auto text-slate-500 leading-relaxed">
                Complete el formulario de la izquierda con la información de su cultivo o hato ganadero para recibir las especificaciones oficiales de productos en Ecuador, dosis exacta y tiempos de retiro.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
