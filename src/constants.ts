export const PLANETS = [
  { id: 'sun', name: 'Sol', symbol: '☉', description: 'Conciencia, identidad, vitalidad.', color: '#ffcc33' },
  { id: 'moon', name: 'Luna', symbol: '☾', description: 'Emociones, refugio, memoria.', color: '#e2e2e2' },
  { id: 'mercury', name: 'Mercurio', symbol: '☿', description: 'Comunicación, mente, aprendizaje.', color: '#888888' },
  { id: 'venus', name: 'Venus', symbol: '♀', description: 'Deseo, vínculos, valoración.', color: '#ff99cc' },
  { id: 'mars', name: 'Marte', symbol: '♂', description: 'Acción, deseo, autoafirmación.', color: '#ff4d4d' },
  { id: 'jupiter', name: 'Júpiter', symbol: '♃', description: 'Expansión, sentido, confianza.', color: '#ffaa00' },
  { id: 'saturn', name: 'Saturno', symbol: '♄', description: 'Estructura, límite, madurez.', color: '#996633' },
  { id: 'uranus', name: 'Urano', symbol: '♅', description: 'Cambio, libertad, originalidad.', color: '#00ffff' },
  { id: 'neptune', name: 'Neptuno', symbol: '♆', description: 'Disolución, ideal, sensibilidad.', color: '#3366ff' },
  { id: 'pluto', name: 'Plutón', symbol: '♇', description: 'Poder, muerte, renacimiento.', color: '#990000' },
  { id: 'north_node', name: 'Nodo Norte', symbol: '☊', description: 'Propósito, destino, evolución futura.', color: '#ffffff' },
  { id: 'south_node', name: 'Nodo Sur', symbol: '☋', description: 'Karma, pasado, talentos heredados.', color: '#bbbbbb' },
];

export const SIGNS = [
  { id: 'aries', name: 'Aries', symbol: '♈', element: 'Fuego', description: 'La fuerza del inicio, el coraje de la acción y la identidad en expansión.' },
  { id: 'taurus', name: 'Tauro', symbol: '♉', element: 'Tierra', description: 'La abundancia de la materia, el placer de los sentidos y la persistencia del alma.' },
  { id: 'gemini', name: 'Géminis', symbol: '♊', element: 'Aire', description: 'La curiosidad que une mundos, la danza de la dualidad y la magia de la expresión.' },
  { id: 'cancer', name: 'Cáncer', symbol: '♋', element: 'Agua', description: 'El refugio de las emociones, la sabiduría del pasado y el poder de la nutrición.' },
  { id: 'leo', name: 'Leo', symbol: '♌', element: 'Fuego', description: 'El brillo del sol interior, la nobleza del corazón y el arte de la propia creación.' },
  { id: 'virgo', name: 'Virgo', symbol: '♍', element: 'Tierra', description: 'El templo del orden, la alquimia del detalle y la pureza del servicio.' },
  { id: 'libra', name: 'Libra', symbol: '♎', element: 'Aire', description: 'La armonía de los espejos, el equilibrio en el encuentro y la belleza de la justicia.' },
  { id: 'scorpio', name: 'Escorpio', symbol: '♏', element: 'Agua', description: 'El misterio de lo profundo, la fuerza del deseo y la transmutación del fénix.' },
  { id: 'sagittarius', name: 'Sagitario', symbol: '♐', element: 'Fuego', description: 'La flecha de la búsqueda, la expansión de la verdad y el fuego de la fe.' },
  { id: 'capricorn', name: 'Capricornio', symbol: '♑', element: 'Tierra', description: 'La cima de la montaña, la estructura del tiempo y el decreto de la realidad.' },
  { id: 'aquarius', name: 'Acuario', symbol: '♒', element: 'Aire', description: 'El rayo del futuro, la libertad de la consciencia y la revolución del espíritu.' },
  { id: 'pisces', name: 'Piscis', symbol: '♓', element: 'Agua', description: 'El océano del inconsciente, la compasión infinita y la disolución en el Todo.' },
];

export const HOUSES = Array.from({ length: 12 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Casa ${i + 1}`,
  description: getHouseDescription(i + 1),
}));

function getHouseDescription(num: number) {
  const descriptions: Record<number, string> = {
    1: 'El Despertar: Personalidad, apariencia física y el impulso vital del nuevo comienzo.',
    2: 'El Sustento: Valores personales, recursos materiales y la seguridad en la materia.',
    3: 'La Conexión: El entorno inmediato, el aprendizaje práctico y el tejido de los pensamientos.',
    4: 'La Raíz: El hogar, la familia, la memoria ancestral y el mundo privado del alma.',
    5: 'La Creación: El goce creativo, el romance, los hijos y el brillo de la expresión individual.',
    6: 'El Orden: La salud, el servicio diario, el trabajo minucioso y la purificación del ser.',
    7: 'El Encuentro: Los vínculos, la pareja, el otro frente a nosotros y los contratos del alma.',
    8: 'La Entrega: La transformación profunda, los bienes compartidos, el sexo y el renacimiento.',
    9: 'La Verdad: La filosofía, los viajes largos, la búsqueda de sentido y la sabiduría superior.',
    10: 'El Destino: La vocación, el estatus público, la realización en el mundo y el legado.',
    11: 'La Comunidad: Los proyectos colectivos, la amistad, la esperanza y la Visión del mañana.',
    12: 'El Retorno: El inconsciente colectivo, el aislamiento sagrado, el karma y lo oculto.',
  };
  return descriptions[num];
}
