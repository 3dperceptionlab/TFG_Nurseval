import { Component, signal, ChangeDetectionStrategy, inject, computed, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faAngleRight, faHourglassHalf} from '@fortawesome/free-solid-svg-icons';
import { Evaluation } from "./evaluation/evaluation";
import { VideoSection } from "./video-section/video-section";
import { Comments } from "./comments/comments";
import { GeneralFeedback } from './general-feedback/general-feedback';
import { ProcedureService } from '../../services/procedure.service';
import { ActivatedRoute } from '@angular/router';
import { ProcedureDetail } from '../../models/procedure.model';
import { DatePipe } from '@angular/common';
import { Auth } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { single } from 'rxjs';
import { warningMessage } from '../../models/modals.model';
import { EvaluationData } from '../../models/forms.model';
import { WarningMessage } from "../../shared/warning-message/warning-message";

@Component({
  selector: 'app-student-dashboard',
  imports: [FontAwesomeModule, Evaluation, VideoSection, Comments, GeneralFeedback, DatePipe, RouterLink, WarningMessage],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
})
export class StudentDashboard {
  readonly icons = { faCheck, faAngleRight, faHourglassHalf};

  authService = inject(Auth);
  procedureService = inject(ProcedureService);
  route = inject(ActivatedRoute);

  enterClass = signal('enter-animation');
  procedure = signal<ProcedureDetail | null>(null);
  isLoading = signal(true);

  currentTime = signal(0);
  seekTarget = signal<number | null>(null);

  finalEval = signal({
    mark: 0,
    comment: ''
  });

  warningMessage = signal<warningMessage>({
    show: false,
    type: 'success',
    title: '',
    message: ''
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('procedureId');
    if (id) {
      this.procedureService.getProcedureById(id).subscribe({
        next: (data) => {
          this.procedure.set(data); 
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error cargando el procedimiento', err);
          this.isLoading.set(false);
        }
      });
    }
  }

  reloadProcedure() {
    const id = this.route.snapshot.paramMap.get('procedureId');
    if (id) {
      this.procedureService.getProcedureById(id).subscribe({
        next: (data) => this.procedure.set(data)
      });
    }
  }

  onChangeMark(newMark: number) {
    this.finalEval.update(current => ({
      ...current,     
      mark: newMark 
    }));

    if (this.procedure()) {
      this.procedure.update(p => p ? {
        ...p,
        globalMetrics: { ...p.globalMetrics, mark: newMark }
      } : null);
    }
  }

  onChangeComment(nuevoComentario: string) {
    this.finalEval.update(current => ({
      ...current,
      comment: nuevoComentario
    }));
  }

  showWarningMessage(title:string, message: string, type: string) {
    this.warningMessage.set({
      show: true,
      type: type,
      title: title,
      message: message
    });

    setTimeout(() => this.clearMessage(), 2000);
  }

  clearMessage() {
    this.warningMessage.update(t => ({ ...t, show: false }));
  }

  onTimeUpdate(time: number) {
    this.currentTime.set(time);
  }

  onSeekRequest(minute: number) {
    this.seekTarget.set(null);
    queueMicrotask(() => this.seekTarget.set(minute));
  }

  finalizeEvaluation() {
    const id = this.route.snapshot.paramMap.get('procedureId');
    if (!id) return;

    const notaActual = this.finalEval().mark || this.procedure()?.globalMetrics?.mark;
    const comentarioActual = this.finalEval().comment || this.procedure()?.comment || '';

    if (!notaActual) {
      this.showWarningMessage('No es posible finalizar la evaluación.','No puedes finalizar la evaluación sin haber asignado una nota.', 'error');
      return;
    }

    if (!comentarioActual.trim()) {
      this.showWarningMessage('No es posible finalizar la evaluación.', 'Es obligatorio incluir un comentario final.', 'error');
      return;
    }

    const evaluationData: EvaluationData = {
      mark: notaActual,
      comment: comentarioActual
    };

    this.procedureService.finalizeEvaluation(id, evaluationData).subscribe({
      next: () => {
        this.warningMessage.set({
          show: true,
          type: 'success',
          title: '¡Bien hecho!',
          message: 'La evaluación ha sido guardada correctamente.'
        });

        this.reloadProcedure(); 
        setTimeout(() => this.clearMessage(), 2000);
      },
      error: () => {
        this.showWarningMessage('No es posible finalizar la evaluación.','Lo sentimos, ha habido un error inesperado.', 'error');
      }
    });
  }
  
}
