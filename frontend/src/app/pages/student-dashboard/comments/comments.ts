import { Component, input, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faPlus, faTriangleExclamation, faPen, faAngleDown,faLightbulb} from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-comments',
  imports: [FontAwesomeModule, RouterLink],
  templateUrl: './comments.html',
  styleUrl: './comments.css',
})
export class Comments {
  readonly icons = { faPlus, faCheck, faTriangleExclamation,faPen,faAngleDown, faLightbulb};
  readonly activeTooltip = signal<any>(null);
  readonly showNotes = signal<boolean>(true);

  evaluation = input<any>();

  showTooltip(nota: any) {
      this.activeTooltip.set(nota);
  }

  hideTooltip() {
      this.activeTooltip.set(null);
  }

  toggleNotes(){
      this.showNotes.set(!this.showNotes());
  }

    // Cálculo de posición en la timeline
  getNotePosition(segundos: number): string {
      const total = this.evaluation().evaluacion.duracion_total_seg;
      const porcentaje = (segundos / total) * 100;
      return `${porcentaje}%`;
  }
}
