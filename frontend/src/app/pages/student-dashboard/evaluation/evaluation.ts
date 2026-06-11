import { Component, computed, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClock, faCheck, faArrowRight, faPlus, faTriangleExclamation,faPen, faPenToSquare, faEye, faChartColumn, faPlay, faExpand, faAngleDown, faVrCardboard, faLightbulb, faHand, faFaceMeh, faStopwatch} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-evaluation',
  imports: [FontAwesomeModule],
  templateUrl: './evaluation.html',
  styleUrl: './evaluation.css',
})
export class Evaluation {
  readonly icons = { faClock, faArrowRight,faPlus, faCheck, faTriangleExclamation,faPen, faPenToSquare, faEye, faChartColumn, faPlay, faExpand, faAngleDown, faVrCardboard, faLightbulb, faHand, faFaceMeh, faStopwatch};

  evaluation = input<any>();

    // Calcula el numero de errores segun las notas
  readonly errorCount = computed(() => {
      return this.evaluation().notas.filter((n: { categoria: string; }) => n.categoria === "problema").length;
  });

  // Calcula la escala de la nota automaticamente si cambia la puntuacion
  readonly markScale = computed(() => {
      const mark = this.evaluation().evaluacion.metricas.puntuacion;
      if (mark < 5) return "deficiente";
      if (mark < 7) return "bien";
      if (mark < 9) return "notable";
      return "sobresaliente";
  });
}
