import { Component, computed, inject, input, output, signal } from '@angular/core';
import { faAngleRight, faAngleLeft, faSearch, faEraser, faImage, faPlus, faXmark, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { forkJoin, Subject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { StudentService } from '../../../services/students.service';
import { WarningMessage } from '../../../shared/warning-message/warning-message';
@Component({
  selector: 'app-add-student-modal',
  standalone: true,
  imports: [FontAwesomeModule, WarningMessage],
  templateUrl: './add-student-modal.html',
  styleUrl: './add-student-modal.css',
})
export class AddStudentModal {
  icons = {faAngleRight, faAngleLeft, faSearch, faEraser, faImage, faPlus, faXmark, faEnvelope};
  studentService = inject(StudentService);
  private searchSubject$ = new Subject<string>();

  selectedStudents = signal<any[]>([]);
  searchQuery = signal(''); 
  
  closeModal = output();
  studentsInvited = output();

  searchResults = toSignal(this.studentService.searchStudents(this.searchSubject$), { initialValue: [] });
  warningMessage = signal<{ show: boolean; type: 'success' | 'error'; title: string; message: string }>({
    show: false,
    type: 'success',
    title: '',
    message: ''
  });

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.searchSubject$.next(value); // Notificar
  }

    // Añadir alumno seleccionado y limpiar buscador
  selectStudent(alumno: any) {
    const exists = this.selectedStudents().some(a => a.id === alumno.id);
    if(!exists)
      this.selectedStudents.update(lista => [...lista, alumno]);

    this.searchSubject$.next('');
    this.searchQuery.set('');
  }

  inviteStudents() {
    const requests = this.selectedStudents().map(alumno =>
        this.studentService.assignProfessor(alumno.id)
    );

    forkJoin(requests).subscribe({
      next: () => {
        this.warningMessage.set({
          show: true,
          type: 'success',
          title: '¡Perfecto!',
          message: 'Has invitado satisfactoriamente a tus alumnos.'
        });

        setTimeout(() => {
          this.studentsInvited.emit();
          this.clearMessage();
        }, 2000);
      },
      error: (err) => {
        this.warningMessage.set({
          show: true,
          type: 'error',
          title: 'Oops...',
          message: 'No ha sido posible realizar la invitación.'
        });

        setTimeout(() => {
          this.clearMessage()
        }, 2000);
      }
    });
  }

  // Quitar alumno de la lista
  deleteStudent(id: number) {
    this.selectedStudents.update(lista => lista.filter(alumno => alumno.id !== id));
  }

  emitCloseModal() {
    this.closeModal.emit();
  }

  clearMessage() {
    this.warningMessage.update(t => ({ ...t, show: false }));
  }
}
