import React, { useState, useEffect } from 'react';
import { AgroProduct, CategoryType, SubCategoryType } from '../types';
import { googleSignIn, initAuth } from '../lib/firebaseAuth';
import {
  saveProductToStore,
  deleteProductFromStore,
  getCustomProducts,
  getAllProducts,
} from '../data/productStore';
import {
  Lock,
  Plus,
  Trash2,
  Edit2,
  X,
  CheckCircle2,
  Package,
  ShieldCheck,
  Search,
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff,
  FileSpreadsheet,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  LogIn,
  ListOrdered,
} from 'lucide-react';

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_ADMIN_PIN = '956515';

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState('');
  const [showPin, setShowPin] = useState(false);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombreComercial: '',
    ingredienteActivo: '',
    categoria: 'agricola' as CategoryType,
    subcategoria: 'Fungicida' as SubCategoryType,
    laboratorioOMarca: '',
    cultivosOEspecies: '',
    dosisRecomendada: '',
    formaAplicacion: '',
    frecuenciaRepeticion: '',
    carenciaCosecha: '',
    resguardoLeche: '',
    resguardoCarne: '',
    presentaciones: '',
    precioAproximadoUSD: 10.0,
    descripcionTecnica: '',
    advertenciasSeguridad: '',
    imagenUrl: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Admin Tab & Google Sheets State
  const [adminTab, setAdminTab] = useState<'catalog' | 'sheets'>('catalog');
  const [sheetsConfig, setSheetsConfig] = useState<any>(null);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [copiedScript, setCopiedScript] = useState(false);
  const [isSigningInGoogle, setIsSigningInGoogle] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);

  // Web App Script & Contacts Settings
  const [webAppUrlInput, setWebAppUrlInput] = useState('');
  const [adminEmailInput, setAdminEmailInput] = useState('motoagroaventura@gmail.com');
  const [adminPhoneInput, setAdminPhoneInput] = useState('593990000000');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSheetsInfo();
      initAuth(
        () => setGoogleConnected(true),
        () => setGoogleConnected(false)
      );
    }
  }, [isAuthenticated]);

  const fetchSheetsInfo = async () => {
    try {
      const res = await fetch('/api/sheets/config');
      const data = await res.json();
      setSheetsConfig(data);
      if (data.scriptUrl) setWebAppUrlInput(data.scriptUrl);
      if (data.adminContactEmail) setAdminEmailInput(data.adminContactEmail);
      if (data.adminContactPhone) setAdminPhoneInput(data.adminContactPhone);

      const ordersRes = await fetch('/api/orders/list');
      const ordersData = await ordersRes.json();
      setOrdersList(ordersData.orders || []);
    } catch (err) {
      console.error('Error al cargar datos de Google Sheets:', err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await fetch('/api/sheets/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptUrl: webAppUrlInput,
          adminEmail: adminEmailInput,
          adminPhone: adminPhoneInput,
        }),
      });
      await fetchSheetsInfo();
      setSuccessMessage('¡Ajustes de Google Sheets y notificaciones guardados exitosamente!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      alert('Error al guardar ajustes');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const APPS_SCRIPT_CODE = `function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Si viene la fila formateada
    if (data.row) {
      sheet.appendRow(data.row);
    } else {
      sheet.appendRow([
        data.orderId || "SAI-" + Math.floor(Math.random()*10000),
        data.fecha || new Date().toLocaleString(),
        data.cliente || "Cliente",
        data.identificacion || "N/A",
        data.telefono || "N/A",
        data.ubicacion || "Finca",
        data.metodoPago || "Efectivo",
        data.items || "",
        data.total || "$0.00",
        "Pendiente"
      ]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({"result": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({"result": "error", "error": err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  const handleGoogleSignInAdmin = async () => {
    setIsSigningInGoogle(true);
    try {
      const res = await googleSignIn();
      if (res?.accessToken) {
        setGoogleConnected(true);
        await fetch('/api/sheets/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: res.accessToken }),
        });
        await fetchSheetsInfo();
        setSuccessMessage('¡Conexión autorizada con Google Sheets exitosamente!');
        setTimeout(() => setSuccessMessage(''), 4000);
      }
    } catch (err: any) {
      console.error('Error Google auth:', err);
      alert('Error de autenticación: ' + (err.message || 'No se pudo autorizar Google Sheets'));
    } finally {
      setIsSigningInGoogle(false);
    }
  };

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === DEFAULT_ADMIN_PIN || pin === '956515') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('PIN incorrecto. Intente nuevamente.');
    }
  };

  const handleResetForm = () => {
    setEditingId(null);
    setFormData({
      nombreComercial: '',
      ingredienteActivo: '',
      categoria: 'agricola',
      subcategoria: 'Fungicida',
      laboratorioOMarca: '',
      cultivosOEspecies: '',
      dosisRecomendada: '',
      formaAplicacion: '',
      frecuenciaRepeticion: '',
      carenciaCosecha: '',
      resguardoLeche: '',
      resguardoCarne: '',
      presentaciones: '',
      precioAproximadoUSD: 10.0,
      descripcionTecnica: '',
      advertenciasSeguridad: '',
      imagenUrl: '',
    });
    setIsFormOpen(false);
  };

  const handleEditProduct = (prod: AgroProduct) => {
    setEditingId(prod.id);
    setFormData({
      nombreComercial: prod.nombreComercial,
      ingredienteActivo: prod.ingredienteActivo,
      categoria: prod.categoria,
      subcategoria: prod.subcategoria,
      laboratorioOMarca: prod.laboratorioOMarca,
      cultivosOEspecies: prod.cultivosOEspecies.join(', '),
      dosisRecomendada: prod.dosisRecomendada,
      formaAplicacion: prod.formaAplicacion,
      frecuenciaRepeticion: prod.frecuenciaRepeticion,
      carenciaCosecha: prod.periodoResguardo.carenciaCosecha || '',
      resguardoLeche: prod.periodoResguardo.leche || '',
      resguardoCarne: prod.periodoResguardo.carne || '',
      presentaciones: prod.presentaciones.join(', '),
      precioAproximadoUSD: prod.precioAproximadoUSD,
      descripcionTecnica: prod.descripcionTecnica,
      advertenciasSeguridad: prod.advertenciasSeguridad,
      imagenUrl: prod.imagenUrl || '',
    });
    setIsFormOpen(true);
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombreComercial || !formData.ingredienteActivo) {
      alert('Por favor complete al menos el nombre comercial e ingrediente activo.');
      return;
    }

    const cultivosArray = formData.cultivosOEspecies
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const presentacionesArray = formData.presentaciones
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const productPayload: AgroProduct = {
      id: editingId || `CUSTOM-${Date.now()}`,
      nombreComercial: formData.nombreComercial,
      ingredienteActivo: formData.ingredienteActivo,
      categoria: formData.categoria,
      subcategoria: formData.subcategoria,
      laboratorioOMarca: formData.laboratorioOMarca || 'Marca Registrada Ecuador',
      cultivosOEspecies: cultivosArray.length > 0 ? cultivosArray : ['General'],
      dosisRecomendada: formData.dosisRecomendada || 'Según etiqueta oficial',
      formaAplicacion: formData.formaAplicacion || 'Aplicación directa',
      frecuenciaRepeticion: formData.frecuenciaRepeticion || 'Según criterio técnico',
      periodoResguardo: {
        ...(formData.carenciaCosecha ? { carenciaCosecha: formData.carenciaCosecha } : {}),
        ...(formData.resguardoLeche ? { leche: formData.resguardoLeche } : {}),
        ...(formData.resguardoCarne ? { carne: formData.resguardoCarne } : {}),
      },
      presentaciones: presentacionesArray.length > 0 ? presentacionesArray : ['Unidad'],
      precioAproximadoUSD: Number(formData.precioAproximadoUSD) || 0,
      descripcionTecnica: formData.descripcionTecnica || 'Producto fitosanitario/veterinario registrado.',
      advertenciasSeguridad: formData.advertenciasSeguridad || 'Mantener fuera del alcance de niños.',
      disponibleEcuador: true,
      imagenUrl:
        formData.imagenUrl ||
        (formData.categoria === 'agricola'
          ? 'https://images.unsplash.com/photo-1592417817098-8f3d6923b092?w=400&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&auto=format&fit=crop&q=80'),
    };

    saveProductToStore(productPayload);
    setSuccessMessage(
      editingId ? '¡Producto actualizado correctamente!' : '¡Nuevo producto añadido al catálogo!'
    );
    setTimeout(() => setSuccessMessage(''), 3000);

    handleResetForm();
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`¿Está seguro de eliminar el producto "${name}"?`)) {
      deleteProductFromStore(id);
      setSuccessMessage('Producto eliminado del catálogo.');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const allProds = getAllProducts();
  const customProds = getCustomProducts();
  const customIds = new Set(customProds.map((p) => p.id));

  const filteredProds = allProds.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.nombreComercial.toLowerCase().includes(q) ||
      p.ingredienteActivo.toLowerCase().includes(q) ||
      p.laboratorioOMarca.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-emerald-900 text-white p-5 px-6 flex items-center justify-between border-b-4 border-emerald-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white uppercase tracking-tight">
                Panel de Administración de Catálogo
              </h3>
              <p className="text-xs text-emerald-200 uppercase tracking-widest font-medium">
                Acceso Privado Administrador • Solución Agropecuaria Integral
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-950 hover:bg-emerald-800 text-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {!isAuthenticated ? (
            /* PIN Security Authentication Screen */
            <div className="max-w-md mx-auto py-8 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                  Autenticación de Administrador
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Ingrese su PIN de seguridad para gestionar o agregar nuevos productos al catálogo.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    PIN de Seguridad
                  </label>
                  <div className="relative">
                    <input
                      type={showPin ? 'text' : 'password'}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="Ingrese su clave de 6 dígitos"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 pl-10 pr-10 outline-none focus:border-emerald-600 font-bold text-slate-900 text-sm"
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {pinError && (
                    <p className="text-xs text-red-600 font-bold mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {pinError}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-500 mt-2 italic">
                    Acceso protegido para administración interna de productos.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-md uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Ingresar al Panel
                </button>
              </form>
            </div>
          ) : (
            /* Admin Panel Dashboard with Lateral Sidebar Navigation */
            <div className="flex flex-col md:flex-row gap-6 min-h-[480px]">
              {/* Lateral Sidebar Tabs */}
              <div className="w-full md:w-60 shrink-0 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2">
                    Menú Lateral de Gestión
                  </p>

                  <button
                    onClick={() => setAdminTab('catalog')}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-left ${
                      adminTab === 'catalog'
                        ? 'bg-emerald-900 text-white shadow-md'
                        : 'text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
                    }`}
                  >
                    <Package className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span className="truncate">Catálogo de Productos ({allProds.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      setAdminTab('sheets');
                      fetchSheetsInfo();
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-left ${
                      adminTab === 'sheets'
                        ? 'bg-emerald-900 text-white shadow-md'
                        : 'text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
                    }`}
                  >
                    <ListOrdered className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span className="truncate">Pedidos a Finca ({ordersList.length})</span>
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-2 text-[11px] text-slate-500">
                  <p className="font-semibold text-slate-600 px-1">
                    Acceso exclusivo para el Propietario/Creador de la Asesoría Virtual.
                  </p>
                  <button
                    onClick={onClose}
                    className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cerrar Panel (X)
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 space-y-6">
                {/* Success Alert */}
                {successMessage && (
                  <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {adminTab === 'sheets' ? (
                  /* Clean Orders Panel - Registered Orders Only */
                  <div className="space-y-4 text-xs">
                    {/* Orders Summary Header */}
                    <div className="bg-emerald-900 text-white p-4.5 rounded-2xl shadow-md border border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Registro de la Asesoría Virtual
                        </span>
                        <h4 className="text-base font-extrabold text-white mt-1 flex items-center gap-2">
                          <ListOrdered className="w-5 h-5 text-emerald-400" />
                          Registro de Pedidos a Finca
                        </h4>
                        <p className="text-xs text-emerald-100/80 mt-0.5">
                          Listado de solicitudes de insumos agropecuarios registradas por los usuarios de la finca.
                        </p>
                      </div>

                      <button
                        onClick={fetchSheetsInfo}
                        className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow shrink-0 self-start sm:self-auto"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Refrescar Lista ({ordersList.length})
                      </button>
                    </div>

                    {/* Orders Table */}
                    <div className="space-y-3">
                      {ordersList.length === 0 ? (
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
                          <ListOrdered className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                          <p className="font-bold text-slate-700">No hay pedidos a finca registrados aún.</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Los pedidos confirmados por los agricultores desde la aplicación aparecerán listados exclusivamente en este panel.
                          </p>
                        </div>
                      ) : (
                        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                          <div className="overflow-x-auto max-h-96 overflow-y-auto">
                            <table className="w-full text-left border-collapse">
                              <thead className="sticky top-0 bg-slate-100 text-slate-700 text-[11px] uppercase font-bold border-b border-slate-200">
                                <tr>
                                  <th className="p-3">Código</th>
                                  <th className="p-3">Fecha</th>
                                  <th className="p-3">Cliente / Teléfono</th>
                                  <th className="p-3">Ubicación Finca</th>
                                  <th className="p-3">Pago</th>
                                  <th className="p-3 text-right">Total USD</th>
                                  <th className="p-3 text-center">Estado</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-xs">
                                {ordersList.map((ord: any) => (
                                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-3 font-mono font-bold text-emerald-800">
                                      {ord.id}
                                    </td>
                                    <td className="p-3 text-slate-600 text-[11px] whitespace-nowrap">
                                      {ord.fecha}
                                    </td>
                                    <td className="p-3">
                                      <div className="font-bold text-slate-900">
                                        {ord.cliente?.nombreCompleto}
                                      </div>
                                      <div className="text-[11px] text-slate-500 font-mono">
                                        Teléfono: {ord.cliente?.telefonoWhatsApp}
                                      </div>
                                    </td>
                                    <td className="p-3 text-[11px] text-slate-700 max-w-[200px] truncate">
                                      {ord.cliente?.provincia}, {ord.cliente?.canton} (Ref: {ord.cliente?.referenciaFinca || 'Finca'})
                                    </td>
                                    <td className="p-3 text-[11px] uppercase font-semibold text-slate-600">
                                      {ord.cliente?.metodoPago}
                                    </td>
                                    <td className="p-3 text-right font-extrabold text-slate-900">
                                      ${Number(ord.montoTotalUSD || 0).toFixed(2)}
                                    </td>
                                    <td className="p-3 text-center">
                                      <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase">
                                        {ord.estado || 'REGISTRADO'}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Catalog Management View */
                  <div className="space-y-6">
                  {/* Top Banner Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Catálogo de Productos Activos: {allProds.length} ({customProds.length} personalizados por usted)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Los productos añadidos se reflejarán inmediatamente en el Catálogo, Asesor IA y Calculadora.
                      </p>
                    </div>

                    {!isFormOpen && (
                      <button
                        onClick={() => {
                          handleResetForm();
                          setIsFormOpen(true);
                        }}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        Ingresar Nuevo Producto
                      </button>
                    )}
                  </div>

                  {/* Product Add/Edit Form */}
              {isFormOpen ? (
                <form
                  onSubmit={handleSubmitProduct}
                  className="bg-slate-50 p-6 rounded-2xl border border-slate-300 space-y-4 text-xs"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Package className="w-4 h-4 text-emerald-700" />
                      {editingId ? 'Editar Producto del Catálogo' : 'Formulario de Nuevo Producto'}
                    </h4>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="text-slate-500 hover:text-slate-800 font-bold"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Nombre Comercial *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nombreComercial}
                        onChange={(e) =>
                          setFormData({ ...formData, nombreComercial: e.target.value })
                        }
                        placeholder="ej. Amistar Top 325 SC"
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-bold outline-none focus:border-emerald-600 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Ingrediente Activo *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.ingredienteActivo}
                        onChange={(e) =>
                          setFormData({ ...formData, ingredienteActivo: e.target.value })
                        }
                        placeholder="ej. Azoxistrobina 200 g/L + Difenoconazol 125 g/L"
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 outline-none focus:border-emerald-600 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Categoría *</label>
                      <select
                        value={formData.categoria}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            categoria: e.target.value as CategoryType,
                          })
                        }
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-800"
                      >
                        <option value="agricola">Agrícola (Fitosaniario / Foliar)</option>
                        <option value="veterinario">Veterinario (Fármaco / Animal)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Subcategoría *</label>
                      <select
                        value={formData.subcategoria}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            subcategoria: e.target.value as SubCategoryType,
                          })
                        }
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-800"
                      >
                        <option value="Fungicida">Fungicida</option>
                        <option value="Insecticida">Insecticida</option>
                        <option value="Herbicida">Herbicida</option>
                        <option value="Fertilizante & Bioestimulante">
                          Fertilizante & Bioestimulante
                        </option>
                        <option value="Antibiótico">Antibiótico</option>
                        <option value="Antiparasitario">Antiparasitario</option>
                        <option value="Vitamina & Suplemento">Vitamina & Suplemento</option>
                        <option value="Vacuna & Biológico">Vacuna & Biológico</option>
                        <option value="Desinfectante & Sanitizante">
                          Desinfectante & Sanitizante
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Laboratorio / Marca
                      </label>
                      <input
                        type="text"
                        value={formData.laboratorioOMarca}
                        onChange={(e) =>
                          setFormData({ ...formData, laboratorioOMarca: e.target.value })
                        }
                        placeholder="ej. Syngenta, Bayer, Zoetis, Agripac"
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 outline-none focus:border-emerald-600 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Cultivos o Especies Compatibles (Separados por coma)
                      </label>
                      <input
                        type="text"
                        value={formData.cultivosOEspecies}
                        onChange={(e) =>
                          setFormData({ ...formData, cultivosOEspecies: e.target.value })
                        }
                        placeholder="ej. Maíz, Papa, Arroz o Bovinos, Porcinos"
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 outline-none focus:border-emerald-600 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Precio Aproximado (USD)
                      </label>
                      <input
                        type="number"
                        step="0.50"
                        min="0"
                        value={formData.precioAproximadoUSD}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            precioAproximadoUSD: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-bold outline-none focus:border-emerald-600 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Dosis Recomendada
                      </label>
                      <input
                        type="text"
                        value={formData.dosisRecomendada}
                        onChange={(e) =>
                          setFormData({ ...formData, dosisRecomendada: e.target.value })
                        }
                        placeholder="ej. 0.3 L/ha o 1 ml por 40 kg peso vivo"
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 outline-none focus:border-emerald-600 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Forma de Aplicación
                      </label>
                      <input
                        type="text"
                        value={formData.formaAplicacion}
                        onChange={(e) =>
                          setFormData({ ...formData, formaAplicacion: e.target.value })
                        }
                        placeholder="ej. Aspersión foliar o Inyección intramuscular"
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 outline-none focus:border-emerald-600 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Frecuencia / Repetición
                      </label>
                      <input
                        type="text"
                        value={formData.frecuenciaRepeticion}
                        onChange={(e) =>
                          setFormData({ ...formData, frecuenciaRepeticion: e.target.value })
                        }
                        placeholder="ej. Repetir a los 12 días o Única dosis"
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 outline-none focus:border-emerald-600 text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Resguardo */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Carencia Cosecha (Agrícola)
                      </label>
                      <input
                        type="text"
                        value={formData.carenciaCosecha}
                        onChange={(e) =>
                          setFormData({ ...formData, carenciaCosecha: e.target.value })
                        }
                        placeholder="ej. 14 días"
                        className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Resguardo Leche (Veterinario)
                      </label>
                      <input
                        type="text"
                        value={formData.resguardoLeche}
                        onChange={(e) =>
                          setFormData({ ...formData, resguardoLeche: e.target.value })
                        }
                        placeholder="ej. 3 días (72 horas)"
                        className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Resguardo Carne (Veterinario)
                      </label>
                      <input
                        type="text"
                        value={formData.resguardoCarne}
                        onChange={(e) =>
                          setFormData({ ...formData, resguardoCarne: e.target.value })
                        }
                        placeholder="ej. 28 días"
                        className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Presentaciones Comerciales (Separadas por coma)
                    </label>
                    <input
                      type="text"
                      value={formData.presentaciones}
                      onChange={(e) =>
                        setFormData({ ...formData, presentaciones: e.target.value })
                      }
                      placeholder="ej. Frasco 250 ml, Frasco 1 Litro, Caneca 20 Litros"
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 outline-none focus:border-emerald-600 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Descripción Técnica Breve
                    </label>
                    <textarea
                      rows={2}
                      value={formData.descripcionTecnica}
                      onChange={(e) =>
                        setFormData({ ...formData, descripcionTecnica: e.target.value })
                      }
                      placeholder="Indique las propiedades del producto y las plagas o enfermedades que controla..."
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 outline-none focus:border-emerald-600 text-slate-900"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md uppercase tracking-wider"
                    >
                      {editingId ? 'Guardar Cambios' : 'Guardar Producto en Catálogo'}
                    </button>
                  </div>
                </form>
              ) : null}

              {/* Product List Table */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filtrar lista de productos por nombre o ingrediente..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-80 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider sticky top-0">
                      <tr>
                        <th className="p-3">Producto / Marca</th>
                        <th className="p-3">Categoría</th>
                        <th className="p-3">Dosis</th>
                        <th className="p-3">Precio USD</th>
                        <th className="p-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                      {filteredProds.map((prod) => {
                        const isCustom = customIds.has(prod.id);
                        return (
                          <tr key={prod.id} className="hover:bg-slate-50">
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <div>
                                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                                    {prod.nombreComercial}
                                    {isCustom && (
                                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                                        Personalizado
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-[11px] text-slate-500">
                                    {prod.ingredienteActivo}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                  prod.categoria === 'agricola'
                                    ? 'bg-emerald-100 text-emerald-900'
                                    : 'bg-amber-100 text-amber-900'
                                }`}
                              >
                                {prod.subcategoria}
                              </span>
                            </td>
                            <td className="p-3 text-[11px] text-slate-600">
                              {prod.dosisRecomendada}
                            </td>
                            <td className="p-3 font-bold text-slate-900">
                              ${prod.precioAproximadoUSD.toFixed(2)}
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleEditProduct(prod)}
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                                  title="Editar producto"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>

                                {isCustom && (
                                  <button
                                    onClick={() =>
                                      handleDeleteProduct(prod.id, prod.nombreComercial)
                                    }
                                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                    title="Eliminar producto personalizado"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )}
        </div>

        {/* Modal Footer Bar with Bottom Close Button */}
        <div className="bg-slate-100 border-t border-slate-200 p-3.5 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 font-semibold rounded-b-3xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Gestión del Catálogo — Asesoría Virtual Agropecuaria</span>
          </div>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm shrink-0 w-full sm:w-auto"
          >
            <X className="w-4 h-4" />
            Cerrar Panel de Gestión (X)
          </button>
        </div>
      </div>
    </div>
  );
};
