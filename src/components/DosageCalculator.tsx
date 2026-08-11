import React, { useState } from 'react';
import { useProducts } from '../data/productStore';
import { Calculator, Clock, Scale, ShieldCheck } from 'lucide-react';

export const DosageCalculator: React.FC = () => {
  const products = useProducts();
  const [calcType, setCalcType] = useState<'veterinario' | 'agricola'>('veterinario');

  // Vet states
  const vetProducts = products.filter((p) => p.categoria === 'veterinario');
  const [selectedVetProductId, setSelectedVetProductId] = useState<string>(vetProducts[0]?.id || '');
  const [animalCount, setAnimalCount] = useState<number>(1);
  const [averageWeightKg, setAverageWeightKg] = useState<number>(450);

  // Agro states
  const agroProducts = products.filter((p) => p.categoria === 'agricola');
  const [selectedAgroProductId, setSelectedAgroProductId] = useState<string>(agroProducts[0]?.id || '');
  const [hectaresOrBombas, setHectaresOrBombas] = useState<'hectareas' | 'bombas'>('bombas');
  const [quantityValue, setQuantityValue] = useState<number>(5);

  const currentVetProduct = vetProducts.find((p) => p.id === selectedVetProductId) || vetProducts[0];
  const currentAgroProduct = agroProducts.find((p) => p.id === selectedAgroProductId) || agroProducts[0];

  // Calculations for Vet
  const calculateVetDose = () => {
    if (!currentVetProduct) return { totalMl: 0, mlPerAnimal: 0 };

    let mlPerAnimal = 0;
    const w = averageWeightKg;

    if (currentVetProduct.nombreComercial.includes('Baytril')) {
      mlPerAnimal = w / 40;
    } else if (currentVetProduct.nombreComercial.includes('Bovimec')) {
      mlPerAnimal = w / 50;
    } else if (currentVetProduct.nombreComercial.includes('Oxitetraciclina')) {
      mlPerAnimal = w / 10;
    } else if (currentVetProduct.nombreComercial.includes('Catosal')) {
      mlPerAnimal = w > 300 ? 15 : 7;
    } else if (currentVetProduct.nombreComercial.includes('Vitamina AD3E')) {
      mlPerAnimal = w > 300 ? 5 : 2;
    } else {
      mlPerAnimal = w / 35;
    }

    return {
      mlPerAnimal: parseFloat(mlPerAnimal.toFixed(2)),
      totalMl: parseFloat((mlPerAnimal * animalCount).toFixed(2)),
    };
  };

  // Calculations for Agro
  const calculateAgroDose = () => {
    if (!currentAgroProduct) return { totalAmount: '', perUnit: '' };

    if (hectaresOrBombas === 'bombas') {
      if (currentAgroProduct.nombreComercial.includes('Ridomil')) {
        return {
          perUnit: '25 gramos por bomba de 20L',
          totalAmount: `${(quantityValue * 25).toFixed(0)} gramos total (${(
            (quantityValue * 25) /
            1000
          ).toFixed(2)} kg)`,
        };
      } else if (currentAgroProduct.nombreComercial.includes('Score')) {
        return {
          perUnit: '15 ml por bomba de 20L',
          totalAmount: `${(quantityValue * 15).toFixed(0)} ml total`,
        };
      } else if (currentAgroProduct.nombreComercial.includes('Karate')) {
        return {
          perUnit: '15 ml por bomba de 20L',
          totalAmount: `${(quantityValue * 15).toFixed(0)} ml total`,
        };
      } else if (currentAgroProduct.nombreComercial.includes('Roundup')) {
        return {
          perUnit: '150 ml por bomba de 20L',
          totalAmount: `${(quantityValue * 150).toFixed(0)} ml total (${(
            (quantityValue * 150) /
            1000
          ).toFixed(2)} Litros)`,
        };
      } else if (currentAgroProduct.nombreComercial.includes('Aminofol')) {
        return {
          perUnit: '25 ml por bomba de 20L',
          totalAmount: `${(quantityValue * 25).toFixed(0)} ml total`,
        };
      } else {
        return {
          perUnit: '20 g/ml por bomba de 20L',
          totalAmount: `${(quantityValue * 20).toFixed(0)} g/ml total`,
        };
      }
    } else {
      return {
        perUnit: currentAgroProduct.dosisRecomendada,
        totalAmount: `Estimado para ${quantityValue} ha según etiqueta oficial.`,
      };
    }
  };

  const vetResults = calculateVetDose();
  const agroResults = calculateAgroDose();

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl mb-6 shadow-md border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600/30 border border-emerald-400/40 rounded-xl flex items-center justify-center text-emerald-300">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Calculadora de Dosis & Resguardo Ecuador</h2>
            <p className="text-xs text-slate-300 mt-1">
              Herramienta de precisión para dosificación animal por kg de peso vivo y volumen foliar agrícola.
            </p>
          </div>
        </div>
      </div>

      {/* Mode selector */}
      <div className="flex justify-center mb-6">
        <div className="bg-slate-200 p-1.5 rounded-2xl flex gap-2">
          <button
            onClick={() => setCalcType('veterinario')}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              calcType === 'veterinario'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            🐄 Fármacos Veterinarios
          </button>
          <button
            onClick={() => setCalcType('agricola')}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              calcType === 'agricola'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            🌾 Fitosaniarios & Foliar
          </button>
        </div>
      </div>

      {/* Calculator Body */}
      {calcType === 'veterinario' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs sm:text-sm">
            <h3 className="font-bold text-slate-900 text-base pb-2 border-b border-slate-100 flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-600" /> Parámetros del Animal
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Seleccione Producto Veterinario *
              </label>
              <select
                value={selectedVetProductId}
                onChange={(e) => setSelectedVetProductId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
              >
                {vetProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombreComercial} ({p.ingredienteActivo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Peso Vivo Promedio del Animal (kg) *
              </label>
              <input
                type="number"
                min="10"
                max="1200"
                value={averageWeightKg}
                onChange={(e) => setAverageWeightKg(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none font-bold text-slate-900"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                (ej. Ternero 80kg, Vaca Holstein adulta 450-500kg, Cerdo engorde 90kg)
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cantidad de Animales a Tratar *
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={animalCount}
                onChange={(e) => setAnimalCount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Results Output */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800 space-y-4">
            <h3 className="font-bold text-amber-400 text-base pb-2 border-b border-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Resultado Dosificación Veterinaria
            </h3>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
              <p className="text-xs text-slate-400 font-medium">Dosis por Animal ({averageWeightKg} kg):</p>
              <p className="text-2xl font-black text-amber-400">
                {vetResults.mlPerAnimal} ml <span className="text-xs font-normal text-slate-300">inyectable</span>
              </p>

              <div className="pt-2 border-t border-slate-700 flex justify-between text-xs">
                <span className="text-slate-300">Total para {animalCount} animales:</span>
                <span className="font-extrabold text-white text-sm">{vetResults.totalMl} ml</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <p>
                <strong className="text-white">Forma de Aplicación:</strong> {currentVetProduct?.formaAplicacion}
              </p>
              <p>
                <strong className="text-white">Frecuencia / Repetición:</strong> {currentVetProduct?.frecuenciaRepeticion}
              </p>
            </div>

            {/* Resguardo Warning */}
            <div className="bg-red-950/80 border border-red-800 text-red-200 p-4 rounded-xl text-xs space-y-1">
              <p className="font-bold text-red-300 flex items-center gap-1">
                <Clock className="w-4 h-4 text-red-400" /> Período Oficial de Resguardo / Retiro en Ecuador:
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1 font-semibold">
                <div>🥛 Leche: {currentVetProduct?.periodoResguardo.leche || '0 días'}</div>
                <div>🥩 Carne: {currentVetProduct?.periodoResguardo.carne || '0 días'}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Agro Calculator */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs sm:text-sm">
            <h3 className="font-bold text-slate-900 text-base pb-2 border-b border-slate-100 flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-600" /> Parámetros Agrícolas
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Seleccione Producto Fitosaniario *
              </label>
              <select
                value={selectedAgroProductId}
                onChange={(e) => setSelectedAgroProductId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
              >
                {agroProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombreComercial} ({p.ingredienteActivo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Unidad de Medida
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setHectaresOrBombas('bombas')}
                  className={`p-2 rounded-xl font-bold text-xs border ${
                    hectaresOrBombas === 'bombas'
                      ? 'bg-emerald-700 text-white border-emerald-800'
                      : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  Bombas de 20 Litros
                </button>
                <button
                  type="button"
                  onClick={() => setHectaresOrBombas('hectareas')}
                  className={`p-2 rounded-xl font-bold text-xs border ${
                    hectaresOrBombas === 'hectareas'
                      ? 'bg-emerald-700 text-white border-emerald-800'
                      : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  Hectáreas (ha)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {hectaresOrBombas === 'bombas' ? 'Número de Bombas de 20L *' : 'Número de Hectáreas *'}
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={quantityValue}
                onChange={(e) => setQuantityValue(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800 space-y-4">
            <h3 className="font-bold text-emerald-400 text-base pb-2 border-b border-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Resultado Mezcla Foliar / Aspersión
            </h3>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
              <p className="text-xs text-slate-400 font-medium">Dosis Recomendada por Unidad:</p>
              <p className="text-xl font-extrabold text-emerald-300">{agroResults.perUnit}</p>

              <div className="pt-2 border-t border-slate-700 flex justify-between text-xs">
                <span className="text-slate-300">Total Necesario:</span>
                <span className="font-extrabold text-amber-400 text-sm">{agroResults.totalAmount}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <p>
                <strong className="text-white">Forma de Aplicación:</strong> {currentAgroProduct?.formaAplicacion}
              </p>
              <p>
                <strong className="text-white">Frecuencia:</strong> {currentAgroProduct?.frecuenciaRepeticion}
              </p>
            </div>

            <div className="bg-amber-950/80 border border-amber-800 text-amber-200 p-4 rounded-xl text-xs space-y-1">
              <p className="font-bold text-amber-300 flex items-center gap-1">
                <Clock className="w-4 h-4 text-amber-400" /> Período de Carencia antes de Cosecha:
              </p>
              <p className="font-extrabold text-white text-sm">
                {currentAgroProduct?.periodoResguardo.carenciaCosecha || '0 días'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
