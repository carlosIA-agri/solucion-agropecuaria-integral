export type CategoryType = 'agricola' | 'veterinario';

export type SubCategoryType = 
  | 'Fungicida'
  | 'Insecticida'
  | 'Herbicida'
  | 'Fertilizante & Bioestimulante'
  | 'Antibiótico'
  | 'Antiparasitario'
  | 'Vitamina & Suplemento'
  | 'Vacuna & Biológico'
  | 'Desinfectante & Sanitizante';

export interface AgroProduct {
  id: string;
  nombreComercial: string;
  ingredienteActivo: string;
  categoria: CategoryType;
  subcategoria: SubCategoryType;
  laboratorioOMarca: string;
  cultivosOEspecies: string[];
  dosisRecomendada: string;
  formaAplicacion: string;
  frecuenciaRepeticion: string;
  periodoResguardo: {
    carne?: string;
    leche?: string;
    carenciaCosecha?: string;
  };
  presentaciones: string[];
  precioAproximadoUSD: number;
  descripcionTecnica: string;
  advertenciasSeguridad: string;
  disponibleEcuador: boolean;
  imagenUrl?: string;
}

export interface DiagnosticFormData {
  sector: CategoryType;
  provincia: string;
  cantonSector: string;
  especieOCultivo: string;
  variedadORaza?: string;
  numeroAnimalesOSuperficie: string;
  etapaDesarrollo: string;
  sintomasObservados: string;
  duracionProblema: string;
  tratamientosPrevios?: string;
  tipoManejo?: string; // e.g., Intensivo, Orgánico, Tradicional
}

export interface WorkPlanItem {
  productId?: string;
  nombreComercial: string;
  ingredienteActivo: string;
  dosisExacta: string;
  formaAplicacion: string;
  frecuenciaYRepeticion: string;
  periodoResguardo: string; // Carne/Leche/Cosecha
  cantidadSugerida: string;
  precioEstimadoUSD: number;
  observacionesTecnicas: string;
  esOpcion1Catalogo?: boolean;
  opcion2Alternativa?: {
    nombreComercial: string;
    ingredienteActivo: string;
    dosisExacta: string;
    observacionesTecnicas: string;
  };
}

export interface TechnicalWorkPlan {
  id: string;
  fecha: string;
  cliente?: string;
  provincia: string;
  sector: 'Agrícola' | 'Pecuario';
  diagnosticoPresuntivo: string;
  causasProbables: string[];
  planDeTratamiento: WorkPlanItem[];
  medidasBioseguridadManejo: string[];
  costoEstimadoInsumosUSD: number;
  resumenGarantia: string;
}

export interface OrderCartItem {
  product: AgroProduct;
  cantidad: number;
  dosisPersonalizada?: string;
}

export interface CustomerContactInfo {
  nombreCompleto: string;
  identificacion: string; // Cédula o RUC
  telefonoWhatsApp: string;
  provincia: string;
  canton: string;
  parroquiaSector: string;
  referenciaFinca: string;
  metodoPago: 'efectivo' | 'transferencia';
  comprobanteTransferencia?: string;
  notasEntrega?: string;
}

export interface ProductOrder {
  id: string;
  fecha: string;
  cliente: CustomerContactInfo;
  items: {
    productId: string;
    nombreComercial: string;
    presentacion: string;
    cantidad: number;
    precioUnitarioUSD: number;
    subtotalUSD: number;
  }[];
  montoTotalUSD: number;
  estado: 'Pendiente de Confirmación' | 'En Preparación' | 'En Camino a Finca' | 'Entregado';
  codigoRastreo: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  mediaName?: string;
  suggestedProducts?: AgroProduct[];
  workPlan?: TechnicalWorkPlan;
}

export interface AuthorizedSpecialist {
  id: string;
  cedula: string;
  nombreCompleto: string;
  tituloEspecialidad: string;
  experienciaAnos: number;
  sectorFocus: 'agricola' | 'pecuario' | 'mixto';
  activoEnTurno: boolean;
  fechaRegistro: string;
}

export interface DailyChatLog {
  id: string;
  fechaIso: string; // YYYY-MM-DD
  hora: string; // HH:mm
  advisorType: 'agricola' | 'pecuario';
  specialistOnDuty: {
    nombreCompleto: string;
    cedula: string;
    titulo: string;
  };
  title: string;
  summarySnippet: string;
  messages: ChatMessage[];
}

