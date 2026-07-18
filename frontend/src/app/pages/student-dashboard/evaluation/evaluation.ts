import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faClock, faCheck, faArrowRight, faPlus, faTriangleExclamation,faPen, faPenToSquare, faEye, faChartColumn, faPlay, faExpand, faAngleDown, faVrCardboard, faLightbulb, faHand, faFaceMeh, faStopwatch} from '@fortawesome/free-solid-svg-icons';
import { GlobalMetrics, ProcedureDetail } from '../../../models/procedure.model';
import { DecimalPipe } from '@angular/common';
import { Auth } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-evaluation',
  imports: [FontAwesomeModule, DecimalPipe, FormsModule],
  templateUrl: './evaluation.html',
  styleUrl: './evaluation.css',
})
export class Evaluation {
  readonly icons = { faXmark, faClock, faArrowRight,faPlus, faCheck, faTriangleExclamation,faPen, faPenToSquare, faEye, faChartColumn, faPlay, faExpand, faAngleDown, faVrCardboard, faLightbulb, faHand, faFaceMeh, faStopwatch};

  authService = inject(Auth);

  isEditingMark = signal(false);
  tempMark = signal<number>(0);
  globalMetrics = input.required<GlobalMetrics>();

  duration = input<number>();

  onChangeMark = output<number>();
  onChangeComment = output<string>();

  // Calcula la escala de la nota automaticamente si cambia la puntuacion
  readonly markScale = computed(() => {
      const mark = this.globalMetrics()?.mark;
      if(!mark) return;
      if (mark < 5) return "deficiente";
      if (mark < 7) return "bien";
      if (mark < 9) return "notable";
      return "sobresaliente";
  });



  // activar edicion de nota
  toggleEditMark() {
    if (!this.isEditingMark()) {
      this.tempMark.set(this.globalMetrics()?.mark || 0);
      this.isEditingMark.set(true);
    } else {
      this.isEditingMark.set(false);
    }
  }

  // guardar nota
  saveMark() {
    const newMark = this.tempMark();
    if (newMark < 0 || newMark > 10) return; 

    this.isEditingMark.set(false);
    this.onChangeMark.emit(this.tempMark());
  }
}
