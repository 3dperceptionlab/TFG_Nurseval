export interface Step {
  id: string
  title: string;
  description: string;
  tip: string;
  image?: string;
}

export interface Protocol {
  id: string;
  title: string;
  purpose: string;
  materials: string[];
  image?: string;
  steps: Step[];
  vide: string;
}

export interface Protocolo {
  nombre?: string;
  objetivo?: string;
  materiales?: string[];
  imagen?: string;
  procedimiento: {
    titulo: string;
    instrucciones: string;
    ilustracion: string;
    notas?: string[];
  }[];
  steps?: Step[];
  video?: string;
}

export const PROTOCOLOS_DATA: Record<string, Protocolo> = {
  capelina: {
    nombre: 'Capelina',
    objetivo: 'Sujetar apósitos de lesiones o heridas amplias que se encuentren en la parte superior de la cabeza.',
    imagen: "capelina.jpg",
    materiales: [
      '2 Vendas elásticas de gasa o crepe',
      'Tape adhesivo o esparadrapo',
      'Tijeras'
    ],
    procedimiento: [
      {
        titulo: 'Anclaje Inicial',
        instrucciones: 'Se comienza realizando dos vueltas circulares de anclaje, sujetando el vendaje con una mano y aplicando una ligera presión. La primera vuelta se coloca a la altura del cuello y, a continuación, se asciende hasta la zona superior de las orejas, cruzando después por la frente pudiendo tapar parte de los ojos. La última vuelta debe finalizar en la parte posterior de la cabeza.',
        ilustracion: "",
        notas:[
            "se podría poner un poco de algodón detrás de las orejas para evitar en algunos casos provocar ulceras por presión."
        ]
      },
      {
        titulo: 'Técnica de Doble Venda',
        instrucciones: 'Ahora entra en juego la segunda mano con la otra venda, que colocará la lengüeta de la venda sobre la vuelta anterior en la parte posterior de la cabeza y se sellará con la venda que estaba dando vueltas. ',
        ilustracion: ""
      },
      {
        titulo: 'Repeticiones',
        instrucciones: 'A partir de este punto se volverá a la zona anterior con una venda dando la vuelta y la otra siendo sellada de nuevo, repitiendo así una secuencia de posterior-anterior, anterior-posterior hasta cubrir toda la parte superior de la cabeza. Se debe procurar que el último trayecto anterior-posterior ocurra por el centro de la cabeza para facilitar la finalización del vendaje.',
        ilustracion: ""
      },
      {
        titulo: 'Corte de una venda',
        instrucciones: 'Una vez sellada la última secuencia en la parte posterior central de la cabeza, se cortará la venda que queda sellada por debajo de la que daba las vueltas y se puede sujetar con una tira de tape.',
        ilustracion: ""
      },
      {
        titulo: 'Finalización',
        instrucciones: 'Con la venda que nos queda se darán entre 4-7 vueltas o hasta que se acabe. Una vez finalizada la venda o las vueltas se recortará y se sellará con tiras de tape. Lo ideal es que la lengüeta final de la venda quede situada en la parte posterior de la cabeza para facilitar la siguiente fase. ',
        ilustracion: ""
      },
      {
        titulo: 'Liberación sensorial',
        instrucciones: 'Ahora se debe recuperar la visión y la escucha del paciente, plegando el vendaje de los extremos inferiores hacia el interior. Esta tarea se empieza desde la zona de los ojos y posteriormente las orejas.',
        ilustracion: ""
      }
    ],
  },
  muñeca: {
    nombre: 'Espiga de Muñeca y Antebrazo',
    objetivo: 'Limitar el movimiento del área de la muñeca, proteger zonas lesionadas del brazo e inmovilizar apósitos.',
    imagen: "",
    materiales: [
      'Venda algodonada pequeña',
      'Venda elástica crepe',
      'Tape',
      'Tijeras'
    ],
    procedimiento: [
      {
        titulo: 'Base Algodonada',
        instrucciones: 'Primero se realizan un par de vueltas circulares en la mano, empezando por la parte superior, rodeando la palma dejando a un lado el pulgar y al otro el resto de dedos.',
        ilustracion: ""
    },
    {
        titulo: 'Descenso al Antebrazo',
        instrucciones: 'Una vez completadas las dos primeras vueltas, se continúa el vendaje en diagonal: la siguiente vuelta rodea el pulgar y desciende hacia la muñeca, para luego seguir cubriendo el antebrazo en forma de espiral, sin llegar a cubrir el codo.',
        ilustracion: ""
    },
    {
        titulo: 'Corte de la Base',
        instrucciones: 'Una vez alcanzado ese punto se corta la venda.',
        ilustracion: ""
    },
    {
        titulo: 'Anclaje con Crepe',
        instrucciones: 'Ahora se comienza con la venda de crepe de nuevo desde la parte superior algodonada de la mano realizando dos vueltas circulares.',
        ilustracion: ""
    },
    {
        titulo: 'Vendaje en Espiga',
        instrucciones: 'Finalizada la segunda vuelta en la palma, se continúa el vendaje de forma diagonal, rodeando el pulgar y la muñeca en sentido ascendente para iniciar el vendaje en espiga. Luego se realizan vueltas en espiga, alternando recorridos ascendentes y descendentes sujetando firmemente y sin arrugas, hasta llegar al extremo de la venda de algodón.',
        ilustracion: ""
    },
    {
        titulo: 'Finalización y Sellado',
        instrucciones: 'Para finalizar se realizan dos vueltas circulares en el extremo y se corta la venda. Por último se fija con tape cubriendo completamente el extremo cortado.',
        ilustracion: ""
    }
    ]
  },
  tobillo: {
    nombre: 'Espiga de Tobillo y Pierna',
    objetivo: 'Proporcionar compresión uniforme, estabilizar el tobillo y mantener materiales de soporte.',
    imagen: "",
    materiales: [
      'Venda algodonada grande',
      'Venda elástica crepe',
      'Tape',
      'Tijeras'
    ],
    procedimiento: [
      {
        titulo: 'Anclaje del Empeine (Algodón)',
        instrucciones: 'Se comienza realizando una o dos vueltas circulares con la venda de algodón desde la parte del empeine rodeando la planta. La última vuelta termina nuevamente en la zona del empeine.',
        ilustracion: ""
    },
    {
        titulo: 'Transición y Espiral',
        instrucciones: 'Desde allí, se realiza una vuelta diagonal que cubre el talón y el tobillo, preparando la venda para continuar con vueltas en espiral que envuelvan la pierna sin llegar a cubrir la rodilla.',
        ilustracion: ""
    },
    {
        titulo: 'Corte de la Base',
        instrucciones: 'Una vez alcanzado el final se corta la venda y se deja lisa sin arrugas.',
        ilustracion: ""
    },
    {
        titulo: 'Anclaje con Crepe',
        instrucciones: 'Ahora se comienza de nuevo desde el empeine a realizar aproximadamente dos vueltas circulares de anclaje con la venda crepe.',
        ilustracion: ""
    },
    {
        titulo: 'Técnica de Espiga',
        instrucciones: 'Una vez finalizadas la vueltas circulares, se comienza a realizar vueltas ascendentes y descendentes de espiga que cubran talón y tobillo sin dejar pliegues ni cambiar la compresión. La técnica en espiga se continúa hasta llegar al extremo algodonado.',
        ilustracion: ""
    },
    {
        titulo: 'Cierre y Sellado',
        instrucciones: 'Por último al alcanzar el extremo se realizan dos vueltas circulares de anclaje y se corta la venda. Se finaliza sellando el extremos con tiras de tape.',
        ilustracion: ""
    }
    ]
  }
};