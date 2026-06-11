import { Component, signal } from '@angular/core';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar-layout',
  imports: [Sidebar, RouterOutlet, FontAwesomeModule],
  templateUrl: './sidebar-layout.html',
  styleUrl: './sidebar-layout.css',
})
export class SidebarLayout {
  hideSidebar = signal(false);

  faBars = faBars;

  toggleSidebar() {
    this.hideSidebar.set(!this.hideSidebar());
  }
}
