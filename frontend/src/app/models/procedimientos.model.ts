// 1. Tipos de datos para asegurar el tipado en Angular
export interface Profesor {
  id: string;
  name: string;
  surname: string;
  email: string;
  position: string;
}

export interface Alumno {
  id: string;
  name: string;
  surname: string;
  email: string;
  course: string;
  group: string;
  professorName: string;
  lastLogin: Date;
  img?: string;
}

export interface AnotacionTimeline {
  type: 'PROBLEMA' | 'MEJORA' | 'CORRECTO';
  time: string; // Formato MM:SS
  title: string;
  description: string;
}

export interface Procedimiento {
  id: string;
  studentId: string;
  studentName: string;
  protocolo: 'Capelina' | 'Muñeca-brazo' | 'Tobillo-pierna';
  fecha: string;
  tiempo: string; // Formato MM:SS
  errores?: number;
  mejoras?: number;
  puntuacion?: number; // 1 al 10
  estado: 'Evaluado' | 'Pendiente';
  timeline?: AnotacionTimeline[]; // Detalles para la pantalla del procedimiento
}


export const PROFESORES: Profesor[] = [
  {
    id: 'PROF_001',
    name: 'Lucía',
    surname: 'Villalobos',
    email: 'lucia.villalobos@nursival.com',
    position: 'Docente / Profesora Asociada',
  },
  {
    id: 'PROF_002',
    name: 'Carlos',
    surname: 'Menéndez',
    email: 'carlos.menendez@nursival.com',
    position: 'Profesor Titular',
  }
];

export const ALUMNOS: Alumno[] = [
  { id: 'ALUM_001', name: 'Abraham', surname: 'Cortés López', email: 'abraham.cortes@example.com', course: 'Cuarto', group: 'Grupo 2', professorName: 'Lucía Villalobos', lastLogin: new Date('10/04/2026') },
  { id: 'ALUM_002', name: 'Lucía', surname: 'Belmonte Ruiz', email: 'lucia.belmonte@example.com', course: 'Cuarto', group: 'Grupo 2', professorName: 'Lucía Villalobos', lastLogin: new Date('10/04/2026') },
  { id: 'ALUM_003', name: 'Alejandro', surname: 'Sanz Peña', email: 'alejandro.sanz@example.com', course: 'Cuarto', group: 'Grupo 1', professorName: 'Lucía Villalobos', lastLogin: new Date('10/04/2026') },
  { id: 'ALUM_004', name: 'Marta', surname: 'Gómez Soler', email: 'marta.gomez@example.com', course: 'Cuarto', group: 'Grupo 3', professorName: 'Carlos Menéndez', lastLogin: new Date('10/04/2026') },
  { id: 'ALUM_005', name: 'Javier', surname: 'Marín Ortiz', email: 'javier.marin@example.com', course: 'Cuarto', group: 'Grupo 2', professorName: 'Lucía Villalobos', lastLogin: new Date('10/04/2026') },
  { id: 'ALUM_006', name: 'Javier', surname: 'Marín Ortiz', email: 'javier.marin@example.com', course: 'Cuarto', group: 'Grupo 2', professorName: 'Lucía Villalobos', lastLogin: new Date('10/04/2026') },
  // { id: 'ALUM_007', name: 'Javier', surname: 'Marín Ortiz', email: 'javier.marin@example.com', course: 'Cuarto', group: 'Grupo 2', professorName: 'Lucía Villalobos', lastLogin: new Date('10/04/2026') }

];

export const PROCEDIMIENTOS: Procedimiento[] = [
  {
    id: 'PROC_1001',
    studentId: 'ALUM_001',
    studentName: 'Abraham Cortés López',
    protocolo: 'Capelina',
    fecha: '10/02/2026',
    tiempo: '05:43',
    errores: 3,
    mejoras: 2,
    puntuacion: 8,
    estado: 'Evaluado',
    timeline: [
      { type: 'MEJORA', time: '00:55', title: 'Tensión del vendaje', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
      { type: 'PROBLEMA', time: '01:02', title: 'Sujeción de venda', description: 'Sujeción floja al iniciar la primera vuelta occipital.' },
      { type: 'MEJORA', time: '02:43', title: 'Recubrimiento', description: 'Buen cruce de guías en la zona parietal.' },
      { type: 'PROBLEMA', time: '03:01', title: 'Presión', description: 'Exceso de presión detectado por sensores en la frente.' },
      { type: 'CORRECTO', time: '04:58', title: 'Cierre del procedimiento', description: 'Fijación limpia y estricta según protocolo.' },
      { type: 'PROBLEMA', time: '05:21', title: 'Pliegues internos', description: 'Se detectan arrugas en la capa base posterior.' }
    ]
  },
  {
    id: 'PROC_1002',
    studentId: 'ALUM_001',
    studentName: 'Abraham Cortés López',
    protocolo: 'Muñeca-brazo',
    fecha: '23/03/2026',
    tiempo: '04:12',
    errores: 2,
    mejoras: 1,
    puntuacion: 9,
    estado: 'Evaluado',
    timeline: [
      { type: 'CORRECTO', time: '00:30', title: 'Alineación articular', description: 'Posición anatómica de la muñeca correcta.' },
      { type: 'PROBLEMA', time: '01:15', title: 'Presión excesiva distal', description: 'Compresión alta en la zona de los metacarpianos.' }
    ]
  },
  {
    id: 'PROC_1003',
    studentId: 'ALUM_001',
    studentName: 'Abraham Cortés López',
    protocolo: 'Capelina',
    fecha: '02/05/2026',
    tiempo: '05:00',
    errores: 10,
    mejoras: 0,
    puntuacion: 4,
    estado: 'Evaluado',
    timeline: [
      { type: 'PROBLEMA', time: '01:10', title: 'Desplazamiento', description: 'La venda pierde el eje central rápidamente.' }
    ]
  },
  {
    id: 'PROC_1004',
    studentId: 'ALUM_001',
    studentName: 'Abraham Cortés López',
    protocolo: 'Tobillo-pierna',
    fecha: '12/06/2026',
    tiempo: '06:15',
    estado: 'Pendiente',
    timeline: [
      { type: 'MEJORA', time: '00:45', title: 'Posición neutra', description: 'Mantiene el pie perfectamente a 90 grados.' },
      { type: 'PROBLEMA', time: '01:55', title: 'Arrugas tendón', description: 'Pliegue peligroso sobre el tendón de Aquiles.' }
    ]
  },
  {
    id: 'PROC_1005',
    studentId: 'ALUM_002',
    studentName: 'Lucía Belmonte Ruiz',
    protocolo: 'Capelina',
    fecha: '10/02/2026',
    tiempo: '04:50',
    errores: 1,
    mejoras: 4,
    puntuacion: 10,
    estado: 'Evaluado'
  }
];