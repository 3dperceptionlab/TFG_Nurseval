import { Component, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClock, faCheck, faArrowRight, faPlus, faTriangleExclamation,faPen, faPenToSquare, faEye, faChartColumn, faPlay, faExpand, faAngleDown, faVrCardboard, faLightbulb, faHand, faFaceMeh, faStopwatch} from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  imports: [ RouterLink, FontAwesomeModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
   changeDetection: ChangeDetectionStrategy.Eager,
})
export class StudentDashboard {
    readonly icons = { faClock, faArrowRight,faPlus, faCheck, faTriangleExclamation,faPen, faPenToSquare, faEye, faChartColumn, faPlay, faExpand, faAngleDown, faVrCardboard, faLightbulb, faHand, faFaceMeh, faStopwatch};
    readonly activeTooltip = signal<any>(null);
    readonly showNotes = signal<boolean>(true);
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
    
    // Calcula la escala de la nota automáticamente si cambia la puntuación
    readonly markScale = computed(() => {
        const mark = this.evaluation().evaluacion.metricas.puntuacion;
        if (mark < 5) return "deficiente";
        if (mark < 7) return "bien";
        if (mark < 9) return "notable";
        return "sobresaliente";
    });

    // Calcula el número de errores segun las notas
    readonly errorCount = computed(() => {
        return this.evaluation().notas.filter(n => n.categoria === "problema").length;
    });

    // Cálculo de posición en la timeline
    getNotePosition(segundos: number): string {
        const total = this.evaluation().evaluacion.duracion_total_seg;
        const porcentaje = (segundos / total) * 100;
        return `${porcentaje}%`;
    }

    showTooltip(nota: any) {
        this.activeTooltip.set(nota);
    }

    hideTooltip() {
        this.activeTooltip.set(null);
    }

    toggleNotes(){
        this.showNotes.set(!this.showNotes());
    }

}
