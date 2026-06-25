import { Component, computed, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faCalendar, faClock, faWarning, faSquareCheck, faChartSimple, faAngleRight, faAngleLeft, faFaceFrownOpen } from '@fortawesome/free-solid-svg-icons';
import { PageSelector } from "../../shared/page-selector/page-selector";
import { ProceduresList } from "./procedures-list/procedures-list";
import { ProcedureService } from '../../services/procedure.service';
import { procedureSummary } from '../../models/procedure.model';
import { ProtocolService } from '../../services/protocol.service';
import { Auth } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../../services/students.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-record',
  imports: [FontAwesomeModule, PageSelector, ProceduresList, RouterLink],
  templateUrl: './student-record.html',
  styleUrl: './student-record.css',
})
export class StudentRecord {
  icons = {faArrowRight, faCalendar, faClock, faWarning, faSquareCheck, faChartSimple, faAngleRight, faAngleLeft, faFaceFrownOpen}

  procedureService = inject(ProcedureService);
  protocolService = inject(ProtocolService);
  studentService = inject(StudentService);
  authService = inject(Auth);
  route = inject(ActivatedRoute);

  isTeacherView = false;
  selectedKey = signal<string>('Capelina');
  studentProcedures = signal<procedureSummary[]>([]);
  studentName = signal('');

  filteredProcedures = computed(() => {
    if(this.selectedKey() === "Todo") return this.studentProcedures();
    return this.studentProcedures().filter((p) => p.protocolName === this.selectedKey());
  });

  ngOnInit() {
    const routeId = this.route.snapshot.paramMap.get('studentId');
    this.isTeacherView = !!routeId;

    const call$ = routeId
      ? this.procedureService.getStudentProcedures(routeId) // profesor
      : this.procedureService.getMyHistory(); //estudiante  

      if(routeId){
        this.studentService.getStudentById(routeId).subscribe({
          next: (s) => this.studentName.set(`${s.name} ${s.surname}`)
        });
      }

    call$.subscribe({ next: (data) => this.studentProcedures.set(data) });
}
}
