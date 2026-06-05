import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BookOpen, ChevronLeft, LogOut, LucideAngularModule, User } from "lucide-angular";

@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule],
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './sidebar.css',
})
export class Sidebar {
    readonly icons = { User, BookOpen, History, LogOut, ChevronLeft };
    menuItems = [
        { label: 'Mi Perfil', icon: 'user', active: false },
        { label: 'Teoria de Vendajes', icon: 'book-open', active: true },
        { label: 'Historial', icon: 'history', active: false },
    ];
}
