import { Component, inject, input, output } from '@angular/core';
import { faAngleRight, faAngleLeft, faSearch, faEraser, faImage, faPlus, faXmark, faEnvelope, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Student } from '../../../models/student.model';
import { StudentService } from '../../../services/students.service';

@Component({
  selector: 'app-students-table',
  imports: [FontAwesomeModule, DatePipe, RouterLink],
  templateUrl: './students-table.html',
  styleUrl: './students-table.css',
})
export class StudentsTable {
  icons = {faAngleRight, faAngleLeft, faSearch, faEraser, faImage, faPlus, faXmark, faEnvelope, faTrash};

  studentService = inject(StudentService);

  students = input.required<Student[]>();
  studentUnlinked = output<string>();

  deleteStudent(studentId: string){
    this.studentService.removeStudentFromProfessor(studentId).subscribe({
      next: () => this.studentUnlinked.emit(studentId),
      error: (err) => console.error('Error al desvincular', err)
    });
  }
}
