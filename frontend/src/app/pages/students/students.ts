import { Component, computed, signal } from '@angular/core';
import { faAngleRight, faAngleLeft, faSearch, faEraser, faImage, faPlus, faXmark, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ALUMNOS } from '../../models/procedimientos.model';
import { RouterLink } from "@angular/router";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-students',
  imports: [FontAwesomeModule, RouterLink, DatePipe],
  templateUrl: './students.html',
  styleUrl: './students.css',
})
export class Students {
  icons = {faAngleRight, faAngleLeft, faSearch, faEraser, faImage, faPlus, faXmark, faEnvelope};
  
  alumnos = signal(ALUMNOS);

  showModal = signal(false);

  searchQuery = signal(''); // Guarda lo que escribe el usuario
  alumnosSeleccionados = signal<any[]>([]); // Alumnos que se van agregando

  // Signal computada que filtra automáticamente cuando cambia 'searchQuery' o 'alumnosSeleccionados'
  resultadosBusqueda = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return [];

    return this.alumnos().filter(alumno => 
      alumno.email.toLowerCase().includes(query) && 
      !this.alumnosSeleccionados().some(sel => sel.id === alumno.id) // No mostrar si ya está seleccionado
    );
  });

  // Añadir alumno seleccionado y limpiar buscador
  seleccionarAlumno(alumno: any) {
    this.alumnosSeleccionados.update(lista => [...lista, alumno]);
    this.searchQuery.set(''); // Limpia el input tras seleccionar
  }

  // Quitar alumno de la lista
  eliminarAlumno(id: number) {
    this.alumnosSeleccionados.update(lista => lista.filter(alumno => alumno.id !== id));
  }
}
