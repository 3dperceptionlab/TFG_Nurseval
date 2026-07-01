import { Component, computed, inject, signal } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PageSelector } from "../../shared/page-selector/page-selector";
import { AddStudentModal } from "./add-student-modal/add-student-modal";
import { StudentsTable } from "./students-table/students-table";
import { Filters } from "./filters/filters";
import { StudentService } from '../../services/students.service';
import { FilterParams, Student } from '../../models/student.model';

@Component({
  selector: 'app-students',
  imports: [FontAwesomeModule, PageSelector, AddStudentModal, StudentsTable, Filters],
  templateUrl: './students.html',
  styleUrl: './students.css',
})
export class Students {
  icons = { faPlus};
  
  studentService = inject(StudentService);

  isLoading = signal<boolean>(false);
  students = signal<Student[]>([]);
  showModal = signal(false);
  
  ngOnInit() {
    this.onFiltersChange({ query: '', course: '', group: '' });
  }

  onFiltersChange(params: FilterParams) {
    this.isLoading.set(true);
    this.studentService.getMyStudents({
      query: params.query,
      course: params.course || null,
      group: params.group || null,
    }).subscribe(data => {
      this.isLoading.set(false);
      this.students.set(data)
    });
  }

  onStudentsInvited() {
    this.showModal.set(false);
    this.onFiltersChange({ query: '', course: '', group: '' }); 
  }
}
