import { Component, computed, ElementRef, inject, input, model, output, signal, viewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faPlus, faTriangleExclamation, faPen, faAngleDown,faLightbulb, faTrash, faXmark} from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
import { Annotation } from '../../../models/procedure.model';
import { form, maxLength, minLength, required, submit, validate } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { ProcedureService } from '../../../services/procedure.service';
import { Auth } from '../../../services/auth.service';
import { FormField } from '@angular/forms/signals';
import { TimeFormatPipe } from '../../../pipes/timeFormat.pipe';


@Component({
  selector: 'app-comments',
  imports: [FontAwesomeModule, RouterLink, FormField, TimeFormatPipe],
  templateUrl: './comments.html',
  styleUrl: './comments.css',
})
export class Comments {
  readonly icons = { faPlus, faCheck, faTriangleExclamation,faPen,faAngleDown, faLightbulb, faTrash, faXmark};
  readonly activeTooltip = signal<any>(null);
  readonly showNotes = signal<boolean>(true);
  readonly hoverTime = signal<number | null>(null);
  readonly hoverX = signal<number>(0);
  showAnnotationForm = signal(false);
  isEditingAnnotation = signal(false);

  isDraggingCursor = signal(false);
  private dragTime = signal<number | null>(null);

  timelineRef = viewChild<ElementRef<HTMLDivElement>>('timeline');
  formTargetRef = viewChild<ElementRef<HTMLDivElement>>('formTarget');

  annotations = input<Annotation[]>();
  duration = input<number>();
  procedureId =input<string>();
  currentTime = input<number>(0);

  onChanged = output<void>(); 
  onShowWarning = output<{ title: string; message: string; type: string }>();
  seekRequest = output<number>();

  authService = inject(Auth);
  procedureService = inject(ProcedureService);

  annotationFormModel = model<Annotation>({
    id: '',
    minute: 0,
    title: '',
    description: '',
    type: 'error',
    tip: ''
  });

  displayedTime = computed(() =>
    this.isDraggingCursor() ? (this.dragTime() ?? this.currentTime()) : this.currentTime()
  );

  minutesInput = computed(() => Math.floor(this.annotationFormModel().minute / 60));
  secondsInput = computed(() => Math.floor(this.annotationFormModel().minute % 60));

  annotationForm = form(this.annotationFormModel, (path) => {
    required(path.title, { message: 'El título es obligatorio.' });
    minLength(path.title, 3, { message: 'El título debe tener al menos 3 caracteres.' });
    maxLength(path.title, 100, { message: 'El título no puede exceder 100 caracteres.' });

    required(path.description, { message: 'La descripción es obligatoria.' });
    minLength(path.description, 5, { message: 'La descripción debe tener al menos 5 caracteres.' });

    required(path.type, { message: 'El tipo es obligatorio.' });

    validate(path.minute, ({ value }) => (value() < 0 ? { kind: 'min', message: 'El minuto no puede ser negativo.' } : null));
  });

  // --------------------------------------- funciones sobre la timeline 
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
    const total = this.duration();
    if(!total) return '';
    const porcentaje = (segundos / total) * 100;
    return `${porcentaje}%`;
  }

  isActiveNote(nota: Annotation): boolean {
    return Math.abs(nota.minute - this.currentTime()) < 1.5;
  }

  jumpTo(nota: Annotation, event: Event) {
    event.preventDefault();
    this.seekRequest.emit(nota.minute);
  }

  onTimelineClick(event: MouseEvent) {
    if(this.authService.userRole() === "student") return;
    const total = this.duration();
    if (!total) return;

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = Math.min(1, Math.max(0, clickX / rect.width));
    const selectedSecond = Math.round(percentage * total);

    if (!this.showAnnotationForm()) {
      this.openNewAnnotationForm();
    }

    this.openNewAnnotationForm(selectedSecond);
  }

  onTimelineMouseMove(event: MouseEvent) {
    const total = this.duration();
    if (!total) return;

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const moveX = event.clientX - rect.left;
    const percentage = Math.min(1, Math.max(0, moveX / rect.width));

    this.hoverTime.set(Math.round(percentage * total));
    this.hoverX.set(moveX);
  }

  onTimelineMouseLeave() {
    this.hoverTime.set(null);
  }

  onCursorMouseDown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation(); // evita que dispare onTimelineClick

    if (!this.duration()) return;

    this.isDraggingCursor.set(true);
    this.dragTime.set(this.currentTime());
    document.addEventListener('mousemove', this.onDocumentMouseMove);
    document.addEventListener('mouseup', this.onDocumentMouseUp);
  }

  private onDocumentMouseMove = (event: MouseEvent) => {
    const total = this.duration();
    const timeline = this.timelineRef()?.nativeElement;
    if (!total || !timeline) return;

    const rect = timeline.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = Math.min(1, Math.max(0, x / rect.width));
    this.dragTime.set(Math.round(percentage * total));
  };

  private onDocumentMouseUp = () => {
    if (!this.isDraggingCursor()) return;

    document.removeEventListener('mousemove', this.onDocumentMouseMove);
    document.removeEventListener('mouseup', this.onDocumentMouseUp);

    const finalTime = this.dragTime();
    this.isDraggingCursor.set(false);
    this.dragTime.set(null);

    if (finalTime !== null) {
      this.seekRequest.emit(finalTime);
    }
  };

  ngOnDestroy() {
    document.removeEventListener('mousemove', this.onDocumentMouseMove);
    document.removeEventListener('mouseup', this.onDocumentMouseUp);
  }

  // --------------------------------------- funciones de formulario
  onMinutesChange(value: string) {
    const mins = Number(value) || 0;
    const secs = this.secondsInput();
    this.annotationFormModel.update(a => ({ ...a, minute: mins * 60 + secs }));
  }

  onSecondsChange(value: string) {
    const secs = Math.min(59, Math.max(0, Number(value) || 0));
    const mins = this.minutesInput();
    this.annotationFormModel.update(a => ({ ...a, minute: mins * 60 + secs }));
  }

  openNewAnnotationForm(timeToSet: number = 0) { 
    this.annotationFormModel.set({
      id: '',
      minute: timeToSet, 
      title: '',
      description: '',
      type: 'error',
      tip: ''
    });
    this.isEditingAnnotation.set(false);
    this.showAnnotationForm.set(true);
  }

  openEditAnnotationForm(annotation: Annotation) {
    this.annotationFormModel.set({ ...annotation });
    this.isEditingAnnotation.set(true);
    this.showAnnotationForm.set(true);
    setTimeout(() => {
      this.formTargetRef()?.nativeElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  }

  cancelAnnotationForm() {
    this.showAnnotationForm.set(false);
    this.annotationFormModel.set({
      id: '', 
      minute: 0, 
      title: '', 
      description: '', 
      type: 'error', 
      tip: ''
    });
  }

  async saveAnnotation(event: Event) {
    event.preventDefault();

    await submit(this.annotationForm, async (validValues) => {
      try {
        const annotationData = validValues().value();
        const procedureId = this.procedureId();

        if (this.isEditingAnnotation()) {
          await firstValueFrom(this.procedureService.editAnnotation(procedureId!, annotationData.id!, annotationData));
          this.onShowWarning.emit({
            title: '¡Anotación modificada!',
            message: 'Se ha modificado satisfactoriamente tu observación.',
            type: 'success'
          });
        } else {
          await firstValueFrom(this.procedureService.addAnnotation(procedureId!, annotationData));
          this.onShowWarning.emit({
            title: '¡Anotación creada!',
            message: 'Se ha creado satisfactoriamente tu observación.',
            type: 'success'
          });
        }

        this.onChanged.emit();
        this.cancelAnnotationForm();
      } catch (error) {
        this.onShowWarning.emit({
          title: 'Error al guardar la anotación',
          message: 'Lo sentimos, ha ocurrido un error inesperado al intentar guardar la anotación.',
          type: 'error'
        });
      }
    });
  }

  async deleteAnnotation() {
    const annotationId = this.annotationFormModel().id;
    const procedureId = this.procedureId();

    if (!annotationId || !procedureId) return;

    if (confirm('¿Estás seguro de que quieres eliminar esta nota permanentemente?')) {
      try {
        await firstValueFrom(this.procedureService.deleteAnnotation(procedureId, annotationId));
        this.onChanged.emit();
        this.onShowWarning.emit({
            title: '¡Anotación eliminada!',
            message: 'Se ha eliminadp satisfactoriamente tu observación.',
            type: 'success'
          });
        this.cancelAnnotationForm();
      } catch (error) {
        this.onShowWarning.emit({
          title: 'Error al eliminar la anotación',
          message: 'Lo sentimos, ha ocurrido un error inesperado al intentar eliminar la anotación.',
          type: 'error'
        });
      }
    }
  }
}
