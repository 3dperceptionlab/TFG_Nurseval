import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faHistory, faBook, faUserCircle, faSignOut, faHourglass, faUserGraduate } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  imports: [FontAwesomeModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './sidebar.css',
})
export class Sidebar {

  role = "doc";
  icons = {faUser, faHistory, faBook, faUserCircle, faSignOut, faUserGraduate};
  menuItems = computed(() => {
    const isStudent = this.role === 'student';

    if (isStudent) {
      return [
        { label: 'Mi Perfil', icon: faUser, route: '/app/profile' },
        { label: 'Teoría', icon: faBook, route: '/app/theory' },
        // Reemplazamos el parámetro dinámico aquí mismo
        { label: 'Historial', icon: faHistory, route: `/app/procedures/:studentId` },
      ];
    } else {
      return [
        { label: 'Mi Perfil', icon: faUser, route: '/app/profile' },
        { label: 'Teoría', icon: faBook, route: '/app/theory' },
        { label: 'Mis alumnos', icon: faUserGraduate, route: '/app/students' },
        { label: 'Por evaluar', icon: faHourglass, route: '/app/pending' },
      ];
    }
  });
  itemSelected = signal('Teoria');

  setItem(item: string) {
    this.itemSelected.set(item);
  }
}
