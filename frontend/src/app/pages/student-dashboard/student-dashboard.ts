import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck} from '@fortawesome/free-solid-svg-icons';
import { Evaluation } from "./evaluation/evaluation";
import { VideoSection } from "./video-section/video-section";
import { Comments } from "./comments/comments";
import { GeneralFeedback } from './general-feedback/general-feedback';

@Component({
  selector: 'app-student-dashboard',
  imports: [FontAwesomeModule, Evaluation, VideoSection, Comments, GeneralFeedback],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
   changeDetection: ChangeDetectionStrategy.Eager,
})
export class StudentDashboard {
    readonly icons = { faCheck};

    enterClass = signal('enter-animation');

    readonly evaluation = signal({
        evaluacion: {
            procedimiento: "Vendaje de capelina",
            alumno: "Juanito",
            fecha: "10/01/2026",
            duracion_total_seg: 324,
            metricas: {
                atencion: 92,
                puntuacion: 8,
            }
        },
        notas: [
            { id: 1, tiempo_seg: 45, timestamp: "00:00:45", titulo: "Sujeción de venda", categoria: "problema", descripcion: "La mano izquierda está sosteniendo el vendaje de manera inestable.", sugerencia: "Es recomendable colocar la mano en un ángulo de 90 grados para mayor firmeza." },
            { id: 2, tiempo_seg: 120, timestamp: "00:02:00", titulo: "Tensión del vendaje", categoria: "mejorable", descripcion: "La presión ejercida es desigual en la zona occipital.", sugerencia: "Mantén una tracción constante al realizar la vuelta de retorno." },
            { id: 3, tiempo_seg: 242, timestamp: "00:04:02", titulo: "Cierre correcto", categoria: "correcto", descripcion: "El anclaje final se ha realizado con la técnica de seguridad adecuada.", sugerencia: null }
        ]
    });
    




}
