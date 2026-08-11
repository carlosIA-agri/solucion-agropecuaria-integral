import { AgroProduct } from '../types';

export const ECUADOR_PRODUCTS: AgroProduct[] = [
  // --- PRODUCTOS AGRÍCOLAS ECUADOR ---
  {
    id: 'AGR-001',
    nombreComercial: 'Ridomil Gold MZ 68 WG',
    ingredienteActivo: 'Mefenoxam 4% + Mancozeb 64%',
    categoria: 'agricola',
    subcategoria: 'Fungicida',
    laboratorioOMarca: 'Syngenta Ecuador',
    cultivosOEspecies: ['Papa', 'Rosa', 'Tomate de Árbol', 'Hortalizas', 'Cacao'],
    dosisRecomendada: '2.0 a 2.5 kg/ha o 25 a 30 gramos por bomba de 20 Litros de agua',
    formaAplicacion: 'Aspersión foliar cubriendo uniformemente la planta',
    frecuenciaRepeticion: 'Aplicar cada 7 a 10 días según presión de la enfermedad (Tizón/Mildeo)',
    periodoResguardo: {
      carenciaCosecha: '14 días antes de la cosecha'
    },
    presentaciones: ['Funda 250g', 'Funda 1 kg', 'Funda 5 kg'],
    precioAproximadoUSD: 18.50,
    descripcionTecnica: 'Fungicida sistémico y de contacto para el control preventivo y curativo de gota/tizón tardío (Phytophthora infestans) y mildeos vellosos.',
    advertenciasSeguridad: 'Usar equipo de protección completo (mascarilla, guantes, gafas). Nocivo para peces.',
    disponibleEcuador: true,
    imagenUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6923b092?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'AGR-002',
    nombreComercial: 'Score 250 EC',
    ingredienteActivo: 'Difenoconazol 250 g/L',
    categoria: 'agricola',
    subcategoria: 'Fungicida',
    laboratorioOMarca: 'Syngenta Ecuador',
    cultivosOEspecies: ['Banano', 'Plátano', 'Cacao', 'Arroz', 'Frutales'],
    dosisRecomendada: '0.3 a 0.4 Litros por hectárea (15 ml por bomba de 20L)',
    formaAplicacion: 'Aspersión foliar terrestre o aérea',
    frecuenciaRepeticion: 'Cada 12 a 15 días en bloques rotacionales',
    periodoResguardo: {
      carenciaCosecha: '21 días antes de la cosecha'
    },
    presentaciones: ['Frasco 250 ml', 'Frasco 1 Litro'],
    precioAproximadoUSD: 34.00,
    descripcionTecnica: 'Fungicida sistémico triazol de alto rendimiento para control de Sigatoka Negra en Banano, Monilia en Cacao y Pyricularia en Arroz.',
    advertenciasSeguridad: 'Tóxico para organismos acuáticos. No lavar equipos cerca de fuentes de agua.',
    disponibleEcuador: true,
    imagenUrl: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'AGR-003',
    nombreComercial: 'Karate Zeon 050 CS',
    ingredienteActivo: 'Lambda-Cihalotrina 50 g/L',
    categoria: 'agricola',
    subcategoria: 'Insecticida',
    laboratorioOMarca: 'Syngenta Ecuador',
    cultivosOEspecies: ['Maíz', 'Papa', 'Arroz', 'Hortalizas', 'Frutales'],
    dosisRecomendada: '150 a 200 ml/ha o 15 ml por bomba de 20 Litros',
    formaAplicacion: 'Aspersión foliar al detectar las primeras plagas',
    frecuenciaRepeticion: 'Repetir cada 8 a 12 días según monitoreo de plagas',
    periodoResguardo: {
      carenciaCosecha: '7 días antes de la cosecha'
    },
    presentaciones: ['Frasco 100 ml', 'Frasco 250 ml', 'Frasco 1 Litro'],
    precioAproximadoUSD: 16.00,
    descripcionTecnica: 'Insecticida pirotroide encapsulado por microtecnología Zeon para el control de gusano cogollero (Spodoptera), polilla de la papa y trips.',
    advertenciasSeguridad: 'Tóxico para abejas. Aplicar temprano en la mañana o al atardecer.',
    disponibleEcuador: true,
    imagenUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'AGR-004',
    nombreComercial: 'Roundup Activo 480 SL',
    ingredienteActivo: 'Glifosato 480 g/L',
    categoria: 'agricola',
    subcategoria: 'Herbicida',
    laboratorioOMarca: 'Bayer CropScience Ecuador',
    cultivosOEspecies: ['Maleza en Palma', 'Cacao', 'Banano', 'Caminos', 'Preparación de Suelos'],
    dosisRecomendada: '1.5 a 2.5 Litros/ha o 150 ml por bomba de 20 Litros',
    formaAplicacion: 'Aspersión dirigida a la maleza verde en crecimiento activo con campana protectora',
    frecuenciaRepeticion: 'Según rebrote o germinación de malezas (cada 45 a 60 días)',
    periodoResguardo: {
      carenciaCosecha: '0 días (herbicida no residual al suelo)'
    },
    presentaciones: ['Envase 1 Litro', 'Galón 4 Litros', 'Caneca 20 Litros'],
    precioAproximadoUSD: 12.50,
    descripcionTecnica: 'Herbicida sistémico no selectivo con tecnología de surfactante de rápida absorción para el control de malezas gramíneas y de hoja ancha.',
    advertenciasSeguridad: 'Evitar la deriva a partes verdes de cultivos útiles.',
    disponibleEcuador: true,
    imagenUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'AGR-005',
    nombreComercial: 'YaraMila Complex NPK',
    ingredienteActivo: 'N 12% + P2O5 11% + K2O 18% + Mg + S + Micronutrientes (B, Fe, Mn, Zn)',
    categoria: 'agricola',
    subcategoria: 'Fertilizante & Bioestimulante',
    laboratorioOMarca: 'Yara Ecuador',
    cultivosOEspecies: ['Maíz', 'Papa', 'Cacao', 'Banano', 'Aguacate', 'Frutales'],
    dosisRecomendada: '150 a 250 kg/ha según análisis de suelo (100g a 200g por planta/cepa)',
    formaAplicacion: 'Edafización incorporada al suelo en banda o corona alrededor de la zona de goteo',
    frecuenciaRepeticion: '2 a 3 aplicaciones por ciclo productivo (siembra, desarrollo y pre-floración)',
    periodoResguardo: {
      carenciaCosecha: '0 días'
    },
    presentaciones: ['Saco 50 kg', 'Saco 25 kg'],
    precioAproximadoUSD: 42.00,
    descripcionTecnica: 'Fertilizante perlado compuesto altamente soluble con nitrógeno en forma nítrica y amoniacal balanceado con fósforo disponible y potasio.',
    advertenciasSeguridad: 'Almacenar en lugar seco y fresco, alejado de la humedad.',
    disponibleEcuador: true,
    imagenUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'AGR-006',
    nombreComercial: 'Aminofol Bioestimulante Fol',
    ingredienteActivo: 'Aminoácidos libres 24% + Extracto de Algas + NPK hidrolizado',
    categoria: 'agricola',
    subcategoria: 'Fertilizante & Bioestimulante',
    laboratorioOMarca: 'EcuaQuímica',
    cultivosOEspecies: ['Todos los cultivos agrícolas (Rosa, Maíz, Papa, Banano, Frutales)'],
    dosisRecomendada: '1.0 Litro por hectárea o 25 ml por bomba de 20 Litros',
    formaAplicacion: 'Aspersión foliar en etapas críticas o estrés hídrico/heladas',
    frecuenciaRepeticion: 'Aplicar cada 15 a 20 días en brotación, cuajado de fruto y recuperación post-estrés',
    periodoResguardo: {
      carenciaCosecha: '0 días'
    },
    presentaciones: ['Frasco 250 ml', 'Frasco 1 Litro', 'Galón 4 L'],
    precioAproximadoUSD: 14.00,
    descripcionTecnica: 'Bioestimulante foliar concentrado que acelera el metabolismo vegetal, mejora el cuajado de frutos y restaura el vigor de las plantas.',
    advertenciasSeguridad: 'Compatible con la mayoría de fitosanitarios excepto aceites minerales.',
    disponibleEcuador: true,
    imagenUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&auto=format&fit=crop&q=80'
  },

  // --- PRODUCTOS VETERINARIOS ECUADOR ---
  {
    id: 'VET-001',
    nombreComercial: 'Baytril 10% Inyectable',
    ingredienteActivo: 'Enrofloxacina 100 mg/ml',
    categoria: 'veterinario',
    subcategoria: 'Antibiótico',
    laboratorioOMarca: 'Elanco / Bayer Vet Ecuador',
    cultivosOEspecies: ['Bovino Leche/Carne', 'Porcino', 'Ovino', 'Caprino'],
    dosisRecomendada: '1 ml por cada 40 kg de peso vivo (2.5 mg/kg de peso vivo)',
    formaAplicacion: 'Vía Intramuscular profunda o Subcutánea',
    frecuenciaRepeticion: 'Aplicar una vez al día (cada 24 horas) durante 3 a 5 días consecutivos',
    periodoResguardo: {
      carne: '14 días después del último tratamiento',
      leche: '4 días (8 ordeños completos)'
    },
    presentaciones: ['Frasco 50 ml', 'Frasco 100 ml', 'Frasco 250 ml'],
    precioAproximadoUSD: 28.50,
    descripcionTecnica: 'Quinolona bactericida de amplio espectro para el tratamiento de infecciones respiratorias (neumonía), neumomastitis, diarreas bacterianas y mastitis aguda.',
    advertenciasSeguridad: 'No administrar más de 10 ml en el mismo sitio de inyección en bovinos.',
    disponibleEcuador: true,
    imagenUrl: 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'VET-002',
    nombreComercial: 'Bovimec 1% Inyectable (L.A.)',
    ingredienteActivo: 'Ivermectina 10 mg/ml',
    categoria: 'veterinario',
    subcategoria: 'Antiparasitario',
    laboratorioOMarca: 'Agrovet Market / Distribución Ecuador',
    cultivosOEspecies: ['Bovinos', 'Porcinos', 'Ovinos', 'Caprinos'],
    dosisRecomendada: '1 ml por cada 50 kg de peso vivo (200 mcg/kg de peso vivo)',
    formaAplicacion: 'Exclusivamente vía Subcutánea en la piel floja de la tabla del cuello o detrás de la paleta',
    frecuenciaRepeticion: 'Repetir cada 60 a 90 días según conteo de huevos por gramo en heces',
    periodoResguardo: {
      carne: '35 días antes del sacrificio',
      leche: 'NO usar en vacas en lactancia ni 28 días antes del parto'
    },
    presentaciones: ['Frasco 100 ml', 'Frasco 500 ml'],
    precioAproximadoUSD: 19.00,
    descripcionTecnica: 'Antiparasitario endectocida de amplio espectro para control de parásitos gastrointestinales, pulmonares, tórsalo (nuche), garrapatas y sarna.',
    advertenciasSeguridad: 'Conservar fuera de la luz solar. Cumplir estrictamente el período de retiro.',
    disponibleEcuador: true,
    imagenUrl: 'https://images.unsplash.com/photo-1570042707222-635293d6a4cd?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'VET-003',
    nombreComercial: 'Catosal con Vitamina B12',
    ingredienteActivo: 'Butafosfán 100 mg + Vitamina B12 (Cianocobalamina) 0.05 mg/ml',
    categoria: 'veterinario',
    subcategoria: 'Vitamina & Suplemento',
    laboratorioOMarca: 'Elanco Ecuador',
    cultivosOEspecies: ['Bovinos', 'Equinos', 'Porcinos', 'Ovinos', 'Caninos'],
    dosisRecomendada: 'Bovinos adultos: 10 a 25 ml; Terneros: 5 a 12 ml; Porcinos: 2.5 a 10 ml',
    formaAplicacion: 'Vía Intramuscular, Subcutánea o Endovenosa',
    frecuenciaRepeticion: 'Aplicar diariamente durante 3 a 5 días según estado debilitado o anestro',
    periodoResguardo: {
      carne: '0 días (Sin tiempo de retiro)',
      leche: '0 días (Sin tiempo de retiro)'
    },
    presentaciones: ['Frasco 100 ml', 'Frasco 250 ml'],
    precioAproximadoUSD: 24.00,
    descripcionTecnica: 'Estimulante metabólico y tónico vigorizante que mejora el rendimiento reproductor, estimula el apetito y recupera animales débiles o convalecientes.',
    advertenciasSeguridad: 'Producto muy seguro. Mantener protegido de la luz directa.',
    disponibleEcuador: true,
    imagenUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'VET-004',
    nombreComercial: 'Oxitetraciclina L.A. 200 mg',
    ingredienteActivo: 'Oxitetraciclina Dihidrato 200 mg/ml',
    categoria: 'veterinario',
    subcategoria: 'Antibiótico',
    laboratorioOMarca: 'Pharmagric Ecuador',
    cultivosOEspecies: ['Bovino', 'Porcino', 'Ovino', 'Caprino'],
    dosisRecomendada: '1 ml por cada 10 kg de peso vivo (20 mg/kg de peso vivo)',
    formaAplicacion: 'Vía Intramuscular profunda',
    frecuenciaRepeticion: 'Dosis única de larga acción (proporciona cobertura por 3 a 4 días). Si es necesario, repetir a las 72 horas.',
    periodoResguardo: {
      carne: '28 días',
      leche: '7 días (14 ordeños)'
    },
    presentaciones: ['Frasco 100 ml', 'Frasco 250 ml', 'Frasco 500 ml'],
    precioAproximadoUSD: 17.50,
    descripcionTecnica: 'Antibiótico de amplio espectro y larga acción para tratamiento de anaplasmosis, fiebre de transporte, gabarro (pododermatitis) y leptospirosis.',
    advertenciasSeguridad: 'No administrar más de 20 ml en un solo punto de inyección en ganado grande.',
    disponibleEcuador: true,
    imagenUrl: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'VET-005',
    nombreComercial: 'Cypermetrina 15% EC (Garrapaticida)',
    ingredienteActivo: 'Cipermetrina 150 g/L',
    categoria: 'veterinario',
    subcategoria: 'Antiparasitario',
    laboratorioOMarca: 'Servinsumos Ecuador',
    cultivosOEspecies: ['Bovinos', 'Equinos', 'Instalaciones Ganaderas / Galpones'],
    dosisRecomendada: '1 ml por cada Litro de agua (100 ml por cada 100 Litros de agua en tanque)',
    formaAplicacion: 'Baño de aspersión a presión mojando todo el cuerpo del animal a contrapelo',
    frecuenciaRepeticion: 'Repetir cada 14 a 21 días en época de alta infestación de garrapatas y mosca de los cuernos',
    periodoResguardo: {
      carne: '48 horas',
      leche: '24 horas (2 ordeños)'
    },
    presentaciones: ['Frasco 100 ml', 'Frasco 250 ml', 'Frasco 1 Litro'],
    precioAproximadoUSD: 11.00,
    descripcionTecnica: 'Antiparasitario externo piretroide para el control efectivo de garrapatas (Rhipicephalus microplus), mosca de los cuernos (Haematobia irritans) y piojos.',
    advertenciasSeguridad: 'Usar guantes y mascarilla durante la preparación. Evitar contaminación de acequias.',
    disponibleEcuador: true,
    imagenUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'VET-006',
    nombreComercial: 'Vitamina AD3E Forte Inyectable',
    ingredienteActivo: 'Vitamina A 500,000 UI + Vitamina D3 75,000 UI + Vitamina E 50 mg/ml',
    categoria: 'veterinario',
    subcategoria: 'Vitamina & Suplemento',
    laboratorioOMarca: 'Laboratorios VET Ecuador',
    cultivosOEspecies: ['Bovino', 'Porcino', 'Ovino', 'Caprino', 'Equino'],
    dosisRecomendada: 'Bovinos adultos: 5 ml; Terneros y Ovinos: 1 a 2 ml; Porcinos: 2 a 3 ml',
    formaAplicacion: 'Vía Intramuscular profunda',
    frecuenciaRepeticion: 'Aplicar cada 60 a 90 días o antes del periodo de empadre/reproducción',
    periodoResguardo: {
      carne: '0 días',
      leche: '0 días'
    },
    presentaciones: ['Frasco 100 ml', 'Frasco 250 ml'],
    precioAproximadoUSD: 15.00,
    descripcionTecnica: 'Complejo vitamínico de alta concentración para la prevención de raquitismo, fomento del celo y fertilidad, aumento de defensas y mejoría de la visión.',
    advertenciasSeguridad: 'No sobrepasar la dosis recomendada.',
    disponibleEcuador: true,
    imagenUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80'
  }
];
