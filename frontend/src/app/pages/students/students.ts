import { Component, computed, signal } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ALUMNOS } from '../../models/procedimientos.model';
import { PageSelector } from "../../shared/page-selector/page-selector";
import { AddStudentModal } from "./add-student-modal/add-student-modal";
import { StudentsTable } from "./students-table/students-table";
import { Filters } from "./filters/filters";

@Component({
  selector: 'app-students',
  imports: [FontAwesomeModule, PageSelector, AddStudentModal, StudentsTable, Filters],
  templateUrl: './students.html',
  styleUrl: './students.css',
})
export class Students {
  icons = { faPlus};
  
  alumnos = signal(ALUMNOS);
  showModal = signal(false);


}
