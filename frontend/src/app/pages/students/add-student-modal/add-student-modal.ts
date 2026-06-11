import { Component, computed, input, output, signal } from '@angular/core';
import { faAngleRight, faAngleLeft, faSearch, faEraser, faImage, faPlus, faXmark, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-add-student-modal',
  imports: [FontAwesomeModule],
  templateUrl: './add-student-modal.html',
  styleUrl: './add-student-modal.css',
})
export class AddStudentModal {
  icons = {faAngleRight, faAngleLeft, faSearch, faEraser, faImage, faPlus, faXmark, faEnvelope};

  students = input.required<any>();

  selectedStudents = signal<any[]>([]);
  searchQuery = signal(''); 

  closeModal = output();

  resultadosBusqueda = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return [];

    return this.students().filter((alumno: { email: string; id: any; }) => 
      alumno.email.toLowerCase().includes(query) && 
      !this.selectedStudents().some(sel => sel.id === alumno.id) 
    );
  });

    // Añadir alumno seleccionado y limpiar buscador
  selectStudent(alumno: any) {
    this.selectedStudents.update(lista => [...lista, alumno]);
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
