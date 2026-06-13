import { Component, computed, inject, input, output, signal } from '@angular/core';
import { faAngleRight, faAngleLeft, faSearch, faEraser, faImage, faPlus, faXmark, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Professor } from '../../../services/professor.service';

@Component({
  selector: 'app-add-student-modal',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './add-student-modal.html',
  styleUrl: './add-student-modal.css',
})
export class AddStudentModal {
  icons = {faAngleRight, faAngleLeft, faSearch, faEraser, faImage, faPlus, faXmark, faEnvelope};
  professorService = inject(Professor);
  private searchSubject$ = new Subject<string>();

  selectedStudents = signal<any[]>([]);
  searchQuery = signal(''); 
  closeModal = output();

  searchResults = toSignal(
   this.professorService.searchStudents(this.searchSubject$),
    { initialValue: [] }
  );

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.searchSubject$.next(value); // Notificar
  }

    // Añadir alumno seleccionado y limpiar buscador
  selectStudent(alumno: any) {
    this.selectedStudents.update(lista => [...lista, alumno]);
    this.searchSubject$.next('');
    this.searchQuery.set('');
  }

  // Quitar alumno de la lista
  deleteStudent(id: number) {
    this.selectedStudents.update(lista => lista.filter(alumno => alumno.id !== id));
  }

  emitCloseModal() {
    this.closeModal.emit();
  }
}
