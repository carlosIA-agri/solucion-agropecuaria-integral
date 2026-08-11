export interface EcuadorProvince {
  nombre: string;
  region: 'Costa' | 'Sierra' | 'Oriente' | 'Insular';
  cantonesPrincipales: string[];
}

export const ECUADOR_PROVINCES: EcuadorProvince[] = [
  // Costa
  { nombre: 'Manabí', region: 'Costa', cantonesPrincipales: ['Portoviejo', 'Manta', 'Chone', 'El Carmen', 'Rocafuerte', 'Quinindé'] },
  { nombre: 'Los Ríos', region: 'Costa', cantonesPrincipales: ['Babahoyo', 'Quevedo', 'Vinces', 'Ventanas', 'Puebloviejo'] },
  { nombre: 'Guayas', region: 'Costa', cantonesPrincipales: ['Guayaquil', 'Daule', 'Milagro', 'Balzar', 'El Triunfo', 'Samborondón'] },
  { nombre: 'El Oro', region: 'Costa', cantonesPrincipales: ['Machala', 'Pasaje', 'Santa Rosa', 'Arenillas', 'Piñas'] },
  { nombre: 'Santo Domingo de los Tsáchilas', region: 'Costa', cantonesPrincipales: ['Santo Domingo', 'La Concordia'] },
  { nombre: 'Esmeraldas', region: 'Costa', cantonesPrincipales: ['Esmeraldas', 'Quinindé', 'Atacames', 'San Lorenzo'] },
  { nombre: 'Santa Elena', region: 'Costa', cantonesPrincipales: ['Santa Elena', 'La Libertad', 'Salinas'] },

  // Sierra
  { nombre: 'Pichincha', region: 'Sierra', cantonesPrincipales: ['Quito', 'Mejía (Machachi)', 'Cayambe', 'Rumiñahui', 'Puerto Quito'] },
  { nombre: 'Cotopaxi', region: 'Sierra', cantonesPrincipales: ['Latacunga', 'Salcedo', 'Pujilí', 'La Maná', 'Saquisilí'] },
  { nombre: 'Tungurahua', region: 'Sierra', cantonesPrincipales: ['Ambato', 'Pelileo', 'Baños', 'Píllaro', 'Cevallos'] },
  { nombre: 'Chimborazo', region: 'Sierra', cantonesPrincipales: ['Riobamba', 'Guano', 'Alausí', 'Colta', 'Chambo'] },
  { nombre: 'Azuay', region: 'Sierra', cantonesPrincipales: ['Cuenca', 'Gualaceo', 'Paute', 'Santa Isabel', 'Sigsig'] },
  { nombre: 'Loja', region: 'Sierra', cantonesPrincipales: ['Loja', 'Catamayo', 'Caltavas', 'Saraguro', 'Puyango'] },
  { nombre: 'Imbabura', region: 'Sierra', cantonesPrincipales: ['Ibarra', 'Otavalo', 'Cotacachi', 'Antonio Ante'] },
  { nombre: 'Carchi', region: 'Sierra', cantonesPrincipales: ['Tulcán', 'Montúfar (San Gabriel)', 'Espejo', 'Bolívar'] },
  { nombre: 'Bolívar', region: 'Sierra', cantonesPrincipales: ['Guaranda', 'San Miguel', 'Chambo', 'Echandía'] },
  { nombre: 'Cañar', region: 'Sierra', cantonesPrincipales: ['Azogues', 'La Troncal', 'Cañar', 'Biblián'] },

  // Oriente
  { nombre: 'Sucumbíos', region: 'Oriente', cantonesPrincipales: ['Nueva Loja (Lago Agrio)', 'Shushufindi', 'Gonzalo Pizarro'] },
  { nombre: 'Orellana', region: 'Oriente', cantonesPrincipales: ['Puerto Francisco de Orellana (El Coca)', 'Loreo', 'Sacha'] },
  { nombre: 'Napo', region: 'Oriente', cantonesPrincipales: ['Tena', 'Archidona', 'El Chaqui'] },
  { nombre: 'Pastaza', region: 'Oriente', cantonesPrincipales: ['Puyo', 'Mera', 'Santa Clara'] },
  { nombre: 'Morona Santiago', region: 'Oriente', cantonesPrincipales: ['Macas', 'Gualaquiza', 'Sucúa', 'Limon Indanza'] },
  { nombre: 'Zamora Chinchipe', region: 'Oriente', cantonesPrincipales: ['Zamora', 'Yantzaza', 'Pangui'] },

  // Insular
  { nombre: 'Galápagos', region: 'Insular', cantonesPrincipales: ['Santa Cruz', 'San Cristóbal', 'Isabela'] }
];
