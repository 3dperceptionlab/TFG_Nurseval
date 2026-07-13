import { Component, signal, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faAngleRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar-layout',
  imports: [Sidebar, RouterOutlet, FontAwesomeModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sidebar-layout.html',
  styleUrl: './sidebar-layout.css',
})
export class SidebarLayout {
  hideSidebar = signal(false);

  faBars = faBars;
  faAngleRight = faAngleRight;

  toggleSidebar() {
    this.hideSidebar.set(!this.hideSidebar());
  }
}
