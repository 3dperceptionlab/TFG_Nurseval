import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faHistory, faBook, faUserCircle, faSignOut, faHourglass, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import { Auth } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [FontAwesomeModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './sidebar.css',
})
export class Sidebar {
  authService = inject(Auth);
  router = inject(Router);

  role = computed(() => this.authService.currentUser()?.role);
  icons = {faUser, faHistory, faBook, faUserCircle, faSignOut, faUserGraduate};

  itemSelected = signal('Teoria');
  menuItems = computed(() => {
    const isStudent = this.role() === 'student';

    if (isStudent) {
      return [
        { label: 'Perfil y Estadísticas', icon: faUser, route: '/app/profile' },
        { label: 'Teoría', icon: faBook, route: '/app/theory' },
        { label: 'Historial', icon: faHistory, route: `/app/record` },
      ];
    } else {
      return [
        { label: 'Perfil y Estadísticas', icon: faUser, route: '/app/profile' },
        { label: 'Teoría', icon: faBook, route: '/app/theory' },
        { label: 'Mis alumnos', icon: faUserGraduate, route: '/app/students' },
        { label: 'Por evaluar', icon: faHourglass, route: '/app/pending' },
      ];
    }
  });

  setItem(item: string) {
    this.itemSelected.set(item);
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigateByUrl('/login');
    });
  }
}
