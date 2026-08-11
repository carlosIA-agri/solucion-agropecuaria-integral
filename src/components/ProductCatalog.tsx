import React, { useState } from 'react';
import { useProducts, saveProductToStore } from '../data/productStore';
import { AgroProduct, CategoryType } from '../types';
import { Search, Clock, ShieldCheck, Tag, PlusCircle, Lock, Info, Camera } from 'lucide-react';

interface ProductCatalogProps {
  onOpenAdminModal?: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onOpenAdminModal }) => {
  const products = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'todas'>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductDetails, setSelectedProductDetails] = useState<AgroProduct | null>(null);

  const handleImageUpload = (product: AgroProduct, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('La imagen no debe superar los 15MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawResult = event.target?.result as string;
      if (!rawResult) return;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const maxDim = 800;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedUrl = canvas.toDataURL('image/jpeg', 0.85);
          const updated = { ...product, imagenUrl: compressedUrl };
          saveProductToStore(updated);
          if (selectedProductDetails?.id === product.id) {
            setSelectedProductDetails(updated);
          }
        }
      };
      img.src = rawResult;
    };
    reader.readAsDataURL(file);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'todas' || product.categoria === selectedCategory;

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      product.nombreComercial.toLowerCase().includes(q) ||
      product.ingredienteActivo.toLowerCase().includes(q) ||
      product.subcategoria.toLowerCase().includes(q) ||
      product.laboratorioOMarca.toLowerCase().includes(q) ||
      product.cultivosOEspecies.some((c) => c.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Search and Filters Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Title */}
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">
                Catálogo Fitosanitario & Veterinario Ecuador
              </h2>
              {onOpenAdminModal && (
                <button
                  onClick={onOpenAdminModal}
                  className="bg-emerald-900 hover:bg-emerald-950 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition-all shrink-0"
                  title="Gestión exclusiva de productos para el administrador"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>+ Agregar / Editar Productos</span>
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Fármacos veterinarios y fitosanitarios con registro oficial de AGROCALIDAD.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por marca (Baytril, Ridomil...), ingrediente o enfermedad..."
              className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none transition-all"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('todas')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'todas'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos los Productos ({products.length})
          </button>

          <button
            onClick={() => setSelectedCategory('agricola')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'agricola'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🌾 Agrícolas (Fungicidas, Herbicidas, Fertilizantes)
          </button>

          <button
            onClick={() => setSelectedCategory('veterinario')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'veterinario'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🐄 Veterinarios (Antibióticos, Antiparasitarios, Vitaminas)
          </button>
        </div>
      </div>

      {/* Grid of Products */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Image & Category Badge */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={product.imagenUrl}
                    alt={product.nombreComercial}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-md shadow ${
                        product.categoria === 'agricola'
                          ? 'bg-emerald-700 text-white'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {product.categoria === 'agricola' ? 'Agrícola' : 'Veterinario'}
                    </span>
                    <span className="bg-slate-900/80 backdrop-blur text-white text-[10px] font-semibold px-2 py-1 rounded-md">
                      {product.subcategoria}
                    </span>
                  </div>

                  <label
                    className="absolute bottom-3 left-3 bg-slate-900/80 hover:bg-emerald-700 text-white backdrop-blur px-2.5 py-1 rounded-md shadow cursor-pointer transition-all flex items-center gap-1 text-[10px] font-bold z-10"
                    title="Subir foto para este producto"
                  >
                    <Camera className="w-3 h-3 text-amber-300" />
                    <span>Subir Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(product, e)}
                    />
                  </label>

                  <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur font-black text-slate-900 text-xs px-2.5 py-1 rounded-md shadow">
                    Ref. ${product.precioAproximadoUSD.toFixed(2)} USD
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {product.laboratorioOMarca}
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                      {product.nombreComercial}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                      i.a: {product.ingredienteActivo}
                    </p>
                  </div>

                  {/* Species or Crops badges */}
                  <div className="flex flex-wrap gap-1">
                    {product.cultivosOEspecies.map((c, i) => (
                      <span
                        key={i}
                        className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  {/* Dosis & Application Details */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs space-y-1.5 text-slate-700">
                    <div>
                      <span className="font-bold text-slate-900">Dosis:</span>{' '}
                      {product.dosisRecomendada}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">Aplicación:</span>{' '}
                      {product.formaAplicacion}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">Frecuencia:</span>{' '}
                      {product.frecuenciaRepeticion}
                    </div>
                  </div>

                  {/* Resguardo / Withdrawal times highlight */}
                  <div className="bg-red-50 border border-red-200 text-red-900 p-2.5 rounded-xl text-[11px] space-y-1">
                    <div className="font-bold flex items-center gap-1 text-red-800">
                      <Clock className="w-3.5 h-3.5" />
                      Período de Resguardo / Carencia:
                    </div>
                    {product.categoria === 'veterinario' ? (
                      <div className="grid grid-cols-2 gap-1 text-[10px]">
                        <div>
                          <span className="font-semibold">Leche:</span>{' '}
                          {product.periodoResguardo.leche || 'N/A'}
                        </div>
                        <div>
                          <span className="font-semibold">Carne:</span>{' '}
                          {product.periodoResguardo.carne || 'N/A'}
                        </div>
                      </div>
                    ) : (
                      <div className="text-[10px]">
                        <span className="font-semibold">Carencia Pre-cosecha:</span>{' '}
                        {product.periodoResguardo.carenciaCosecha || '0 días'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Details */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-500 font-medium">
                  Presentaciones: {product.presentaciones.join(', ')}
                </div>
                <button
                  onClick={() => setSelectedProductDetails(product)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white flex items-center gap-1 transition-colors shadow-sm"
                >
                  <Info className="w-3.5 h-3.5" /> Ficha Técnica
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-3">
          <p className="text-base font-bold text-slate-800">
            No se encontraron productos con ese criterio de búsqueda.
          </p>
          <p className="text-xs">
            Pruebe buscando por marca registrada en Ecuador como "Baytril", "Ridomil", "Bovimec" o por principio activo.
          </p>
        </div>
      )}

      {/* Modal for Technical Sheet / Details */}
      {selectedProductDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase">
                  {selectedProductDetails.laboratorioOMarca} • AGROCALIDAD
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {selectedProductDetails.nombreComercial}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProductDetails(null)}
                className="text-slate-400 hover:text-slate-600 p-1 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="relative h-44 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
              <img
                src={selectedProductDetails.imagenUrl}
                alt={selectedProductDetails.nombreComercial}
                className="w-full h-full object-cover"
              />
              <label className="absolute bottom-2 right-2 bg-slate-900/90 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow cursor-pointer transition-all flex items-center gap-1.5 border border-slate-700">
                <Camera className="w-3.5 h-3.5 text-amber-300" />
                <span>Cambiar / Subir Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(selectedProductDetails, e)}
                />
              </label>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <p><strong>Ingrediente Activo:</strong> {selectedProductDetails.ingredienteActivo}</p>
              <p><strong>Categoría:</strong> {selectedProductDetails.categoria === 'agricola' ? 'Agrícola' : 'Veterinario'}</p>
              <p><strong>Dosis Recomendada:</strong> {selectedProductDetails.dosisRecomendada}</p>
              <p><strong>Forma de Aplicación:</strong> {selectedProductDetails.formaAplicacion}</p>
              <p><strong>Frecuencia:</strong> {selectedProductDetails.frecuenciaRepeticion}</p>
              <p className="text-slate-600 mt-2"><strong>Descripción Técnica:</strong> {selectedProductDetails.descripcionTecnica}</p>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mt-3 text-amber-900">
                <strong>Advertencias & Bioseguridad:</strong> {selectedProductDetails.advertenciasSeguridad}
              </div>
            </div>

            <button
              onClick={() => setSelectedProductDetails(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase py-2.5 rounded-xl transition-colors mt-4"
            >
              Cerrar Ficha Técnica
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
