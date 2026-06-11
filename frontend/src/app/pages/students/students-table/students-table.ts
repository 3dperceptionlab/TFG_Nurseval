import { Component, input } from '@angular/core';
import { faAngleRight, faAngleLeft, faSearch, faEraser, faImage, faPlus, faXmark, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-students-table',
  imports: [FontAwesomeModule, DatePipe, RouterLink],
  templateUrl: './students-table.html',
  styleUrl: './students-table.css',
})
export class StudentsTable {
  icons = {faAngleRight, faAngleLeft, faSearch, faEraser, faImage, faPlus, faXmark, faEnvelope};

  students = input.required<any>();
}
